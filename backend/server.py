from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from enum import Enum


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Enums
class BullyingType(str, Enum):
    VERBAL = "verbal"
    PHYSICAL = "physical"
    PSYCHOLOGICAL = "psychological"
    CYBERBULLYING = "cyberbullying"
    SEXUAL = "sexual"
    SOCIAL_EXCLUSION = "social_exclusion"
    OTHER = "other"


class ReportStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"


# Models
class BullyingReport(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: Optional[str] = None  # Optional for anonymous reports
    age: int
    class_name: str
    bullying_type: BullyingType
    date_occurred: str
    location: str
    description: str
    is_anonymous: bool = False
    status: ReportStatus = ReportStatus.PENDING
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class BullyingReportCreate(BaseModel):
    name: Optional[str] = None
    age: int
    class_name: str
    bullying_type: BullyingType
    date_occurred: str
    location: str
    description: str
    is_anonymous: bool = False


class BullyingReportUpdate(BaseModel):
    status: ReportStatus


class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


def prepare_for_mongo(data):
    """Convert datetime objects to ISO strings for MongoDB storage"""
    if isinstance(data.get('created_at'), datetime):
        data['created_at'] = data['created_at'].isoformat()
    if isinstance(data.get('updated_at'), datetime):
        data['updated_at'] = data['updated_at'].isoformat()
    return data


def parse_from_mongo(item):
    """Convert ISO strings back to datetime objects from MongoDB"""
    if isinstance(item.get('created_at'), str):
        item['created_at'] = datetime.fromisoformat(item['created_at'])
    if isinstance(item.get('updated_at'), str):
        item['updated_at'] = datetime.fromisoformat(item['updated_at'])
    return item


# Basic routes
@api_router.get("/")
async def root():
    return {"message": "Cicero Sem Bullying API"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    status_data = prepare_for_mongo(status_obj.dict())
    _ = await db.status_checks.insert_one(status_data)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    parsed_checks = [parse_from_mongo(check) for check in status_checks]
    return [StatusCheck(**status_check) for status_check in parsed_checks]


# Bullying report routes
@api_router.post("/reports", response_model=BullyingReport)
async def create_report(input: BullyingReportCreate):
    """Create a new bullying report"""
    report_dict = input.dict()
    report_obj = BullyingReport(**report_dict)
    report_data = prepare_for_mongo(report_obj.dict())
    
    try:
        result = await db.bullying_reports.insert_one(report_data)
        return report_obj
    except Exception as e:
        logging.error(f"Error creating report: {e}")
        raise HTTPException(status_code=500, detail="Failed to create report")


@api_router.get("/reports", response_model=List[BullyingReport])
async def get_reports():
    """Get all bullying reports (admin only)"""
    try:
        reports = await db.bullying_reports.find().sort("created_at", -1).to_list(1000)
        parsed_reports = [parse_from_mongo(report) for report in reports]
        return [BullyingReport(**report) for report in parsed_reports]
    except Exception as e:
        logging.error(f"Error fetching reports: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch reports")


@api_router.get("/reports/{report_id}", response_model=BullyingReport)
async def get_report(report_id: str):
    """Get a specific bullying report"""
    try:
        report = await db.bullying_reports.find_one({"id": report_id})
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        
        parsed_report = parse_from_mongo(report)
        return BullyingReport(**parsed_report)
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching report {report_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch report")


@api_router.put("/reports/{report_id}/status", response_model=BullyingReport)
async def update_report_status(report_id: str, update: BullyingReportUpdate):
    """Update the status of a bullying report"""
    try:
        update_data = {
            "status": update.status,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        result = await db.bullying_reports.update_one(
            {"id": report_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Report not found")
        
        # Fetch and return updated report
        updated_report = await db.bullying_reports.find_one({"id": report_id})
        parsed_report = parse_from_mongo(updated_report)
        return BullyingReport(**parsed_report)
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error updating report status {report_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to update report status")


@api_router.get("/reports/stats/summary")
async def get_reports_summary():
    """Get summary statistics of reports"""
    try:
        total_reports = await db.bullying_reports.count_documents({})
        pending_reports = await db.bullying_reports.count_documents({"status": "pending"})
        in_progress_reports = await db.bullying_reports.count_documents({"status": "in_progress"})
        resolved_reports = await db.bullying_reports.count_documents({"status": "resolved"})
        anonymous_reports = await db.bullying_reports.count_documents({"is_anonymous": True})
        
        return {
            "total_reports": total_reports,
            "pending_reports": pending_reports,
            "in_progress_reports": in_progress_reports,
            "resolved_reports": resolved_reports,
            "anonymous_reports": anonymous_reports
        }
    except Exception as e:
        logging.error(f"Error fetching reports summary: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch reports summary")


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()