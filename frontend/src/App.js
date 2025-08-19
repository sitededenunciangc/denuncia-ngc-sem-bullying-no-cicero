import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Textarea } from "./components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Switch } from "./components/ui/switch";
import { Badge } from "./components/ui/badge";
import { Separator } from "./components/ui/separator";
import { AlertTriangle, Shield, Phone, MessageCircle, Users, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "./hooks/use-toast";
import { Toaster } from "./components/ui/toaster";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Main Home Component
const Home = () => {
  const [showReportForm, setShowReportForm] = useState(false);
  const { toast } = useToast();

  const handleEmergencyContact = () => {
    window.open('https://wa.me/5511999999999?text=Olá, preciso de apoio psicológico urgente - Mayara Aline', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-orange-400">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="https://customer-assets.emergentagent.com/job_cfc6b6a9-35fb-4ef2-9aaf-edad1c671d3d/artifacts/yz2dikpo_geracaocicero_14040526_143329620-removebg-preview.png" 
                alt="Logo Grêmio" 
                className="h-16 w-16 object-contain"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Cícero Sem Bullying</h1>
                <p className="text-orange-600 font-medium">Nova Geração do Cícero</p>
              </div>
            </div>
            <img 
              src="https://customer-assets.emergentagent.com/job_cfc6b6a9-35fb-4ef2-9aaf-edad1c671d3d/artifacts/j47j9vz1_escolacicero_14040526_143344113-removebg-preview.png" 
              alt="Logo Escola" 
              className="h-16 w-16 object-contain"
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!showReportForm ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center py-12">
              <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl mx-auto border-t-4 border-orange-400">
                <div className="flex justify-center mb-6">
                  <Shield className="h-20 w-20 text-orange-500" />
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  Sua Segurança é Nossa Prioridade
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Um espaço seguro para denunciar bullying e buscar apoio. 
                  Estamos aqui para proteger você e garantir um ambiente escolar saudável.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => setShowReportForm(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    Fazer Denúncia
                  </Button>
                  <Button 
                    onClick={handleEmergencyContact}
                    variant="outline" 
                    className="border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50 px-8 py-4 text-lg rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    Apoio Psicológico
                  </Button>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-white hover:shadow-xl transition-all duration-300 border-l-4 border-orange-400">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-8 w-8 text-orange-500" />
                    <CardTitle className="text-gray-800">Denúncia Segura</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Relate casos de bullying de forma confidencial. Você pode escolher se identificar ou permanecer anônimo.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white hover:shadow-xl transition-all duration-300 border-l-4 border-yellow-400">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-8 w-8 text-yellow-600" />
                    <CardTitle className="text-gray-800">Apoio Profissional</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Contato direto com a psicóloga Mayara Aline (MED+ e Conviva SP) para suporte emocional.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white hover:shadow-xl transition-all duration-300 border-l-4 border-black">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Users className="h-8 w-8 text-gray-800" />
                    <CardTitle className="text-gray-800">Acompanhamento</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    O Grêmio Estudantil acompanha cada caso para garantir que seja resolvido adequadamente.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Support Contact */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl p-8 text-center text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-4">Precisa de Ajuda Imediata?</h3>
              <p className="text-lg mb-6">
                Entre em contato com nossa psicóloga especializada
              </p>
              <div className="space-y-4">
                <div className="bg-white/20 rounded-xl p-4">
                  <p className="font-semibold text-lg">Psicóloga Mayara Aline</p>
                  <p>MED+ e Conviva SP</p>
                </div>
                <Button 
                  onClick={handleEmergencyContact}
                  className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg rounded-xl shadow-lg font-semibold transition-all duration-300"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Falar no WhatsApp
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <ReportForm onBack={() => setShowReportForm(false)} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold mb-2">E.E PEI Prof. Cícero Siqueira Campos</p>
          <p className="text-gray-400">Em parceria com o Grêmio Estudantil "Nova Geração do Cícero"</p>
          <p className="text-gray-400 mt-4">Juntos por uma escola sem bullying</p>
        </div>
      </footer>
    </div>
  );
};

// Report Form Component
const ReportForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    class_name: '',
    bullying_type: '',
    date_occurred: '',
    location: '',
    description: '',
    is_anonymous: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const bullyingTypes = {
    'verbal': 'Bullying Verbal (xingamentos, apelidos)',
    'physical': 'Bullying Físico (agressões, empurrões)',
    'psychological': 'Bullying Psicológico (intimidação, humilhação)',
    'cyberbullying': 'Cyberbullying (redes sociais, mensagens)',
    'sexual': 'Assédio Sexual',
    'social_exclusion': 'Exclusão Social',
    'other': 'Outro'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        age: parseInt(formData.age),
        name: formData.is_anonymous ? null : formData.name
      };

      await axios.post(`${API}/reports`, submitData);
      
      toast({
        title: "Denúncia enviada com sucesso!",
        description: "Sua denúncia foi recebida e será analisada pelo Grêmio Estudantil.",
      });

      // Reset form
      setFormData({
        name: '',
        age: '',
        class_name: '',
        bullying_type: '',
        date_occurred: '',
        location: '',
        description: '',
        is_anonymous: false
      });

      setTimeout(() => onBack(), 2000);
    } catch (error) {
      toast({
        title: "Erro ao enviar denúncia",
        description: "Ocorreu um erro. Tente novamente ou procure ajuda presencial.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white shadow-2xl border-t-4 border-orange-400">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-gray-800 mb-2">Formulário de Denúncia</CardTitle>
          <p className="text-gray-600">Preencha os campos abaixo para relatar o ocorrido</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Anonymous Toggle */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <Switch
                  id="anonymous"
                  checked={formData.is_anonymous}
                  onCheckedChange={(checked) => setFormData({...formData, is_anonymous: checked})}
                />
                <Label htmlFor="anonymous" className="text-sm font-medium">
                  Enviar denúncia de forma anônima
                </Label>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Marque esta opção se preferir não se identificar
              </p>
            </div>

            {/* Name Field - Only show if not anonymous */}
            {!formData.is_anonymous && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required={!formData.is_anonymous}
                  className="border-gray-300 focus:border-orange-400"
                />
              </div>
            )}

            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age">Idade *</Label>
              <Input
                id="age"
                type="number"
                min="10"
                max="25"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                required
                className="border-gray-300 focus:border-orange-400"
              />
            </div>

            {/* Class */}
            <div className="space-y-2">
              <Label htmlFor="class_name">Turma *</Label>
              <Input
                id="class_name"
                value={formData.class_name}
                onChange={(e) => setFormData({...formData, class_name: e.target.value})}
                placeholder="Ex: 1º A, 2º B, 3º C"
                required
                className="border-gray-300 focus:border-orange-400"
              />
            </div>

            {/* Bullying Type */}
            <div className="space-y-2">
              <Label htmlFor="bullying_type">Tipo de Bullying/Abuso *</Label>
              <Select value={formData.bullying_type} onValueChange={(value) => setFormData({...formData, bullying_type: value})}>
                <SelectTrigger className="border-gray-300 focus:border-orange-400">
                  <SelectValue placeholder="Selecione o tipo de bullying" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(bullyingTypes).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date_occurred">Data do Ocorrido *</Label>
              <Input
                id="date_occurred"
                type="date"
                value={formData.date_occurred}
                onChange={(e) => setFormData({...formData, date_occurred: e.target.value})}
                required
                className="border-gray-300 focus:border-orange-400"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Local do Ocorrido *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Ex: Pátio, Sala de aula, Corredor"
                required
                className="border-gray-300 focus:border-orange-400"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição do Ocorrido *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descreva detalhadamente o que aconteceu..."
                required
                rows={5}
                className="border-gray-300 focus:border-orange-400"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1 border-gray-300 hover:bg-gray-50"
              >
                Voltar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Denúncia'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// Admin Dashboard Component
const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReports();
    fetchSummary();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get(`${API}/reports`);
      setReports(response.data);
    } catch (error) {
      toast({
        title: "Erro ao carregar denúncias",
        description: "Não foi possível carregar as denúncias.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await axios.get(`${API}/reports/stats/summary`);
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      await axios.put(`${API}/reports/${reportId}/status`, { status: newStatus });
      toast({
        title: "Status atualizado",
        description: "O status da denúncia foi atualizado com sucesso.",
      });
      fetchReports();
      fetchSummary();
    } catch (error) {
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da denúncia.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { color: 'bg-yellow-500', text: 'Pendente', icon: Clock },
      'in_progress': { color: 'bg-blue-500', text: 'Em Andamento', icon: AlertCircle },
      'resolved': { color: 'bg-green-500', text: 'Resolvido', icon: CheckCircle }
    };
    
    const StatusIcon = statusMap[status]?.icon || Clock;
    
    return (
      <Badge className={`${statusMap[status]?.color || 'bg-gray-500'} text-white`}>
        <StatusIcon className="w-3 h-3 mr-1" />
        {statusMap[status]?.text || status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <header className="bg-white shadow-lg border-b-4 border-orange-400">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">Painel do Grêmio</h1>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-lg p-2">
                {summary.total_reports || 0} Denúncias
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-yellow-100 border-yellow-300">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-800">{summary.pending_reports || 0}</p>
              <p className="text-yellow-600">Pendentes</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-100 border-blue-300">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-800">{summary.in_progress_reports || 0}</p>
              <p className="text-blue-600">Em Andamento</p>
            </CardContent>
          </Card>

          <Card className="bg-green-100 border-green-300">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-800">{summary.resolved_reports || 0}</p>
              <p className="text-green-600">Resolvidos</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-100 border-gray-300">
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{summary.anonymous_reports || 0}</p>
              <p className="text-gray-600">Anônimas</p>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <Card className="bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">Todas as Denúncias</CardTitle>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhuma denúncia encontrada.</p>
            ) : (
              <div className="space-y-6">
                {reports.map((report) => (
                  <Card key={report.id} className="border-l-4 border-orange-400">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-800">
                            {report.is_anonymous ? 'Denúncia Anônima' : report.name}
                          </h3>
                          <p className="text-gray-600">
                            {report.age} anos • Turma: {report.class_name}
                          </p>
                        </div>
                        {getStatusBadge(report.status)}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Tipo:</p>
                          <p className="text-gray-600">{report.bullying_type}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Data:</p>
                          <p className="text-gray-600">{report.date_occurred}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Local:</p>
                          <p className="text-gray-600">{report.location}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Enviado em:</p>
                          <p className="text-gray-600">
                            {new Date(report.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Descrição:</p>
                        <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                          {report.description}
                        </p>
                      </div>

                      <Separator className="my-4" />

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateReportStatus(report.id, 'pending')}
                          disabled={report.status === 'pending'}
                          className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                        >
                          Pendente
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateReportStatus(report.id, 'in_progress')}
                          disabled={report.status === 'in_progress'}
                          className="text-blue-600 border-blue-300 hover:bg-blue-50"
                        >
                          Em Andamento
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateReportStatus(report.id, 'resolved')}
                          disabled={report.status === 'resolved'}
                          className="text-green-600 border-green-300 hover:bg-green-50"
                        >
                          Resolvido
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;