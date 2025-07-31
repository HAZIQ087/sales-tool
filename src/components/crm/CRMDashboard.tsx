import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  MessageSquare,
  Phone,
  Calendar,
  Star,
  TrendingUp,
  ArrowLeft,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  MessageCircle
} from "lucide-react";
import { useCustomers } from "@/hooks/useCustomers";
import { useWhatsAppChats } from "@/hooks/useWhatsAppChats";
import { CustomerForm } from "@/components/forms/CustomerForm";
import CallInterface from "@/components/crm/CallInterface";

interface CRMDashboardProps {
  onBack: () => void;
}

const CRMDashboard = ({ onBack }: CRMDashboardProps) => {
  const [activeTab, setActiveTab] = useState("customers");
  const [showCallInterface, setShowCallInterface] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const { customers, loading: customersLoading, updateCustomer, deleteCustomer } = useCustomers();
  const { chats, loading: chatsLoading } = useWhatsAppChats();

  // Calculate stats from real data
  const customerStats = useMemo(() => {
    const total = customers.length;
    const vip = customers.filter(c => c.customer_type === 'vip').length;
    const thisMonth = customers.filter(c => {
      const createdDate = new Date(c.created_at);
      const now = new Date();
      return createdDate.getMonth() === now.getMonth() && 
             createdDate.getFullYear() === now.getFullYear();
    }).length;
    const inactive = customers.filter(c => c.status === 'inactive').length;

    return { total, vip, thisMonth, inactive };
  }, [customers]);

  // Format WhatsApp chats data
  const formattedChats = useMemo(() => {
    return chats.map(chat => ({
      customer: chat.customer_name || chat.customer_phone,
      lastMessage: chat.last_message || "Sin mensajes",
      time: new Date(chat.message_time).toLocaleTimeString('es-MX', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      status: chat.status === 'pending' ? 'Pendiente' : 
              chat.status === 'responded' ? 'Respondido' : 'Cerrado',
      unread: chat.unread_count
    }));
  }, [chats]);

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <header className="bg-card border-b shadow-soft px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Users className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">CRM - Gestión de Clientes</h1>
              <p className="text-sm text-muted-foreground">Sistema completo de relación con clientes</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <CustomerForm />
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="customers">Clientes</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="followups">Seguimientos</TabsTrigger>
          </TabsList>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Clientes</p>
                      <p className="text-2xl font-bold text-primary">{customerStats.total}</p>
                    </div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Clientes VIP</p>
                      <p className="text-2xl font-bold text-accent">{customerStats.vip}</p>
                    </div>
                    <Star className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Nuevos (Mes)</p>
                      <p className="text-2xl font-bold text-secondary">{customerStats.thisMonth}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Inactivos</p>
                      <p className="text-2xl font-bold text-destructive">{customerStats.inactive}</p>
                    </div>
                    <Users className="h-8 w-8 text-destructive" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input placeholder="Buscar clientes..." className="pl-10" />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </div>

                {/* Customer List */}
                <div className="space-y-4">
                  {customersLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Cargando clientes...</p>
                    </div>
                  ) : customers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-16 w-16 mx-auto mb-4" />
                      <p>No hay clientes registrados</p>
                      <p className="text-sm">Agrega tu primer cliente con el botón "Nuevo Cliente"</p>
                    </div>
                  ) : (
                    customers.map((customer) => (
                      <div key={customer.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{customer.name}</h4>
                              <Badge variant={customer.customer_type === 'vip' ? 'default' : 'secondary'}>
                                {customer.customer_type === 'vip' ? 'VIP' : 
                                 customer.customer_type === 'frequent' ? 'Frecuente' : 'Regular'}
                              </Badge>
                              <Badge variant={customer.status === 'active' ? 'secondary' : 'outline'}>
                                {customer.status === 'active' ? 'Activo' : 'Inactivo'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{customer.phone || 'Sin teléfono'}</p>
                            <p className="text-sm text-muted-foreground">
                              {customer.projects_count} proyectos • Último: {
                                customer.last_purchase_date 
                                  ? new Date(customer.last_purchase_date).toLocaleDateString('es-MX')
                                  : 'Nunca'
                              }
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-bold text-primary">${customer.total_spent.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">total gastado</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                const newName = prompt("Nombre:", customer.name);
                                if (newName && newName !== customer.name) {
                                  updateCustomer(customer.id, { name: newName });
                                }
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                               variant="ghost" 
                               size="sm"
                               onClick={() => {
                                 setSelectedCustomer(customer);
                                 setShowCallInterface(true);
                               }}
                             >
                               <Phone className="h-4 w-4" />
                             </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* WhatsApp Tab */}
          <TabsContent value="whatsapp" className="space-y-6">
            <Card className="border-green-200 bg-gradient-to-r from-green-50 to-green-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp Business Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4">Chats Recientes</h4>
                    <div className="space-y-3">
                      {chatsLoading ? (
                        <div className="text-center py-4 text-muted-foreground">
                          <p>Cargando chats...</p>
                        </div>
                      ) : formattedChats.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                          <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm">No hay chats recientes</p>
                        </div>
                      ) : (
                        formattedChats.map((chat, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <MessageSquare className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">{chat.customer}</p>
                              <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                                {chat.lastMessage}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">{chat.time}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={chat.status === 'Pendiente' ? 'destructive' : 'secondary'} className="text-xs">
                                {chat.status}
                              </Badge>
                              {chat.unread > 0 && (
                                <Badge variant="default" className="text-xs">
                                  {chat.unread}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Automatización AI</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-white rounded-lg border">
                        <p className="font-medium text-sm">Respuestas Automáticas</p>
                        <p className="text-xs text-muted-foreground">Activas 24/7 con estilo Alex Dey</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg border">
                        <p className="font-medium text-sm">Cotizaciones en Tiempo Real</p>
                        <p className="text-xs text-muted-foreground">Precios y stock actualizados</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg border">
                        <p className="font-medium text-sm">Seguimiento de Proyectos</p>
                        <p className="text-xs text-muted-foreground">Notificaciones automáticas</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Proyectos de Construcción</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-16 w-16 mx-auto mb-4" />
                  <p>Módulo de proyectos en desarrollo</p>
                  <p className="text-sm">Gestión de proyectos de construcción por cliente</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Follow-ups Tab */}
          <TabsContent value="followups" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Seguimientos y Recordatorios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Phone className="h-16 w-16 mx-auto mb-4" />
                  <p>Módulo de seguimientos en desarrollo</p>
                  <p className="text-sm">Programación automática de llamadas y visitas</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Call Interface Modal */}
      {showCallInterface && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            <CallInterface 
              customerPhone={selectedCustomer.phone}
              customerName={selectedCustomer.name}
              onCallStatusChange={(status) => {
                if (status === 'idle') {
                  setTimeout(() => {
                    setShowCallInterface(false);
                    setSelectedCustomer(null);
                  }, 1000);
                }
              }}
            />
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => {
                setShowCallInterface(false);
                setSelectedCustomer(null);
              }}
            >
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMDashboard;