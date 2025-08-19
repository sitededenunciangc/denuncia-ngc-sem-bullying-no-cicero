#!/usr/bin/env python3
"""
Backend API Tests for Cícero Sem Bullying Application
Tests all API endpoints for the anti-bullying reporting system
"""

import requests
import sys
import json
from datetime import datetime, date
from typing import Dict, Any

class CiceroBullyingAPITester:
    def __init__(self, base_url="https://cicero-support.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.created_report_id = None

    def log_test(self, name: str, success: bool, details: str = ""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED {details}")
        else:
            print(f"❌ {name} - FAILED {details}")
        return success

    def test_health_check(self):
        """Test GET /api/ - Basic health check"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                expected_message = "Cicero Sem Bullying API"
                if data.get("message") == expected_message:
                    return self.log_test("Health Check", True, f"- Status: {response.status_code}, Message: {data.get('message')}")
                else:
                    return self.log_test("Health Check", False, f"- Wrong message: {data.get('message')}")
            else:
                return self.log_test("Health Check", False, f"- Status: {response.status_code}")
                
        except Exception as e:
            return self.log_test("Health Check", False, f"- Error: {str(e)}")

    def test_create_report_identified(self):
        """Test POST /api/reports - Create identified bullying report"""
        report_data = {
            "name": "João Silva Santos",
            "age": 15,
            "class_name": "2º B",
            "bullying_type": "verbal",
            "date_occurred": "2024-01-15",
            "location": "Pátio da escola",
            "description": "Colegas ficaram me chamando de apelidos ofensivos durante o recreio. Isso acontece todos os dias e está me deixando muito triste.",
            "is_anonymous": False
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/reports", 
                json=report_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            success = response.status_code == 200
            
            if success:
                data = response.json()
                # Store the report ID for later tests
                self.created_report_id = data.get("id")
                
                # Validate response structure
                required_fields = ["id", "name", "age", "class_name", "bullying_type", "status"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields and data.get("name") == report_data["name"]:
                    return self.log_test("Create Identified Report", True, f"- ID: {self.created_report_id}")
                else:
                    return self.log_test("Create Identified Report", False, f"- Missing fields: {missing_fields}")
            else:
                return self.log_test("Create Identified Report", False, f"- Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            return self.log_test("Create Identified Report", False, f"- Error: {str(e)}")

    def test_create_report_anonymous(self):
        """Test POST /api/reports - Create anonymous bullying report"""
        report_data = {
            "name": None,
            "age": 16,
            "class_name": "3º A",
            "bullying_type": "cyberbullying",
            "date_occurred": "2024-01-20",
            "location": "Redes sociais",
            "description": "Estão espalhando fotos minhas editadas de forma humilhante nos grupos da escola. Não sei mais o que fazer.",
            "is_anonymous": True
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/reports", 
                json=report_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            success = response.status_code == 200
            
            if success:
                data = response.json()
                
                # Validate anonymous report
                if data.get("is_anonymous") == True and data.get("name") is None:
                    return self.log_test("Create Anonymous Report", True, f"- ID: {data.get('id')}")
                else:
                    return self.log_test("Create Anonymous Report", False, f"- Anonymous flag or name incorrect")
            else:
                return self.log_test("Create Anonymous Report", False, f"- Status: {response.status_code}")
                
        except Exception as e:
            return self.log_test("Create Anonymous Report", False, f"- Error: {str(e)}")

    def test_get_all_reports(self):
        """Test GET /api/reports - List all reports (admin)"""
        try:
            response = requests.get(f"{self.api_url}/reports", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                if isinstance(data, list):
                    return self.log_test("Get All Reports", True, f"- Found {len(data)} reports")
                else:
                    return self.log_test("Get All Reports", False, f"- Response is not a list")
            else:
                return self.log_test("Get All Reports", False, f"- Status: {response.status_code}")
                
        except Exception as e:
            return self.log_test("Get All Reports", False, f"- Error: {str(e)}")

    def test_get_single_report(self):
        """Test GET /api/reports/{id} - Get specific report"""
        if not self.created_report_id:
            return self.log_test("Get Single Report", False, "- No report ID available")
            
        try:
            response = requests.get(f"{self.api_url}/reports/{self.created_report_id}", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                if data.get("id") == self.created_report_id:
                    return self.log_test("Get Single Report", True, f"- Retrieved report {self.created_report_id}")
                else:
                    return self.log_test("Get Single Report", False, f"- ID mismatch")
            else:
                return self.log_test("Get Single Report", False, f"- Status: {response.status_code}")
                
        except Exception as e:
            return self.log_test("Get Single Report", False, f"- Error: {str(e)}")

    def test_update_report_status(self):
        """Test PUT /api/reports/{id}/status - Update report status"""
        if not self.created_report_id:
            return self.log_test("Update Report Status", False, "- No report ID available")
            
        # Test updating to in_progress
        try:
            update_data = {"status": "in_progress"}
            response = requests.put(
                f"{self.api_url}/reports/{self.created_report_id}/status",
                json=update_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            success = response.status_code == 200
            
            if success:
                data = response.json()
                if data.get("status") == "in_progress":
                    return self.log_test("Update Report Status", True, f"- Updated to in_progress")
                else:
                    return self.log_test("Update Report Status", False, f"- Status not updated correctly")
            else:
                return self.log_test("Update Report Status", False, f"- Status: {response.status_code}")
                
        except Exception as e:
            return self.log_test("Update Report Status", False, f"- Error: {str(e)}")

    def test_get_summary_stats(self):
        """Test GET /api/reports/stats/summary - Get statistics"""
        try:
            response = requests.get(f"{self.api_url}/reports/stats/summary", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                expected_fields = ["total_reports", "pending_reports", "in_progress_reports", "resolved_reports", "anonymous_reports"]
                missing_fields = [field for field in expected_fields if field not in data]
                
                if not missing_fields:
                    return self.log_test("Get Summary Stats", True, f"- Total: {data.get('total_reports')}, Pending: {data.get('pending_reports')}")
                else:
                    return self.log_test("Get Summary Stats", False, f"- Missing fields: {missing_fields}")
            else:
                return self.log_test("Get Summary Stats", False, f"- Status: {response.status_code}")
                
        except Exception as e:
            return self.log_test("Get Summary Stats", False, f"- Error: {str(e)}")

    def test_bullying_types_validation(self):
        """Test all bullying types are accepted"""
        bullying_types = ["verbal", "physical", "psychological", "cyberbullying", "sexual", "social_exclusion", "other"]
        
        for bullying_type in bullying_types:
            report_data = {
                "name": f"Test User {bullying_type}",
                "age": 14,
                "class_name": "1º C",
                "bullying_type": bullying_type,
                "date_occurred": "2024-01-10",
                "location": "Sala de aula",
                "description": f"Teste para tipo de bullying: {bullying_type}",
                "is_anonymous": False
            }
            
            try:
                response = requests.post(
                    f"{self.api_url}/reports", 
                    json=report_data,
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )
                
                if response.status_code != 200:
                    return self.log_test("Bullying Types Validation", False, f"- Type '{bullying_type}' rejected")
                    
            except Exception as e:
                return self.log_test("Bullying Types Validation", False, f"- Error with type '{bullying_type}': {str(e)}")
        
        return self.log_test("Bullying Types Validation", True, f"- All {len(bullying_types)} types accepted")

    def test_invalid_report_creation(self):
        """Test validation for invalid report data"""
        # Test missing required fields
        invalid_data = {
            "name": "Test User",
            # Missing age, class_name, etc.
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/reports", 
                json=invalid_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            # Should return 422 (validation error) or 400 (bad request)
            if response.status_code in [400, 422]:
                return self.log_test("Invalid Report Validation", True, f"- Correctly rejected invalid data")
            else:
                return self.log_test("Invalid Report Validation", False, f"- Should reject invalid data, got {response.status_code}")
                
        except Exception as e:
            return self.log_test("Invalid Report Validation", False, f"- Error: {str(e)}")

    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting Cícero Sem Bullying Backend API Tests")
        print(f"📍 Testing API at: {self.api_url}")
        print("=" * 60)
        
        # Run tests in logical order
        self.test_health_check()
        self.test_create_report_identified()
        self.test_create_report_anonymous()
        self.test_get_all_reports()
        self.test_get_single_report()
        self.test_update_report_status()
        self.test_get_summary_stats()
        self.test_bullying_types_validation()
        self.test_invalid_report_creation()
        
        # Print summary
        print("=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All backend tests PASSED! API is working correctly.")
            return 0
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests FAILED. Check the issues above.")
            return 1

def main():
    """Main function to run the tests"""
    tester = CiceroBullyingAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())