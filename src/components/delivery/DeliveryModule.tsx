import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft,
  Truck,
  Package,
  MapPin,
  Clock,
  User,
  Phone,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  CheckCircle,
  AlertCircle,
  XCircle,
  MessageCircle,
  Send
} from "lucide-react";
import { useSales } from "@/hooks/useSales";
import { useCustomers } from "@/hooks/useCustomers";
import { useToast } from "@/hooks/use-toast";
import { WhatsAppDeliveryService } from "@/services/whatsappDeliveryService";

interface DeliveryModuleProps {
  onBack: () => void;
}

interface DeliveryRoute {
  id: string;
  name: string;
  driver: string;
  vehicle: string;
  status: 'active' | 'inactive';
  deliveries: number;
  estimatedTime: string;
}

interface Delivery {
  id: string;
  sale_id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  items: any[];
  total_amount: number;
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'failed';
  assigned_driver: string;
  assigned_vehicle: string;
  route_id: string;
  scheduled_date: string;
  delivery_date?: string;
  notes: string;
}

const DeliveryModule = ({ onBack }: DeliveryModuleProps) => {
  const [activeTab, setActiveTab] = useState("deliveries");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isNewDeliveryOpen, setIsNewDeliveryOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  const { sales } = useSales();
  const { customers } = useCustomers();
  const { toast } = useToast();

  // Mock data - would come from database
  const [deliveries, setDeliveries] = useState<Delivery[]>([
    {
      id: "1",
      sale_id: "sale-1",
      customer_name: "Juan Pérez",
      customer_phone: "5551234567",
      delivery_address: "Av. Principal 123, Col. Centro",
      items: [{ name: "Cemento", quantity: 10 }, { name: "Varilla", quantity: 5 }],
      total_amount: 2500,
      status: 'pending',
      assigned_driver: "",
      assigned_vehicle: "",
      route_id: "",
      scheduled_date: new Date().toISOString().split('T')[0],
      notes: "Entrega en horario de oficina"
    },
    {
      id: "2",
      sale_id: "sale-2",
      customer_name: "María González",
      customer_phone: "5555678901",
      delivery_address: "Calle Secundaria 456, Col. Norte",
      items: [{ name: "Blocks", quantity: 100 }],
      total_amount: 3200,
      status: 'assigned',
      assigned_driver: "Carlos Ruiz",
      assigned_vehicle: "Camión 001",
      route_id: "route-1",
      scheduled_date: new Date().toISOString().split('T')[0],
      notes: "Revisar acceso para camión"
    }
  ]);

  const [routes, setRoutes] = useState<DeliveryRoute[]>([
    {
      id: "route-1",
      name: "Ruta Centro",
      driver: "Carlos Ruiz",
      vehicle: "Camión 001",
      status: 'active',
      deliveries: 3,
      estimatedTime: "4 horas"
    },
    {
      id: "route-2",
      name: "Ruta Norte",
      driver: "Pedro López",
      vehicle: "Camión 002",
      status: 'active',
      deliveries: 2,
      estimatedTime: "3 horas"
    }
  ]);

  const [drivers] = useState([
    { id: "1", name: "Carlos Ruiz", phone: "555-1111", license: "ABC123" },
    { id: "2", name: "Pedro López", phone: "555-2222", license: "DEF456" },
    { id: "3", name: "Ana Martín", phone: "555-3333", license: "GHI789" }
  ]);

  const [vehicles] = useState([
    { id: "1", name: "Camión 001", capacity: "5 toneladas", status: "available" },
    { id: "2", name: "Camión 002", capacity: "3 toneladas", status: "available" },
    { id: "3", name: "Camioneta 003", capacity: "1 tonelada", status: "maintenance" }
  ]);

  // Filter deliveries
  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.delivery_address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || delivery.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Statistics
  const totalDeliveries = deliveries.length;
  const pendingDeliveries = deliveries.filter(d => d.status === 'pending').length;
  const inTransitDeliveries = deliveries.filter(d => d.status === 'in_transit').length;
  const deliveredToday = deliveries.filter(d => d.status === 'delivered').length;

  const handleAssignDelivery = async (deliveryId: string, driverId: string, vehicleId: string) => {
    const delivery = deliveries.find(d => d.id === deliveryId);
    if (!delivery) return;

    const driver = drivers.find(d => d.id === driverId);
    const vehicle = vehicles.find(v => v.id === vehicleId);

    setDeliveries(prev => prev.map(d => 
      d.id === deliveryId 
        ? { 
            ...d, 
            status: 'assigned' as const,
            assigned_driver: driver?.name || '',
            assigned_vehicle: vehicle?.name || ''
          }
        : d
    ));

    // Send WhatsApp notification
    try {
      await WhatsAppDeliveryService.sendDeliveryStatusUpdate({
        customer_phone: delivery.customer_phone,
        customer_name: delivery.customer_name,
        delivery_id: deliveryId,
        status: 'assigned',
        driver_name: driver?.name,
        vehicle: vehicle?.name,
        estimated_time: "2-4 horas",
        delivery_address: delivery.delivery_address
      });

      toast({
        title: "Entrega asignada",
        description: "La entrega ha sido asignada y el cliente notificado por WhatsApp",
      });
    } catch (error) {
      toast({
        title: "Entrega asignada",
        description: "La entrega ha sido asignada correctamente",
      });
    }
  };

  const handleUpdateDeliveryStatus = async (deliveryId: string, newStatus: Delivery['status']) => {
    const delivery = deliveries.find(d => d.id === deliveryId);
    if (!delivery) return;

    setDeliveries(prev => prev.map(d => 
      d.id === deliveryId 
        ? { 
            ...d, 
            status: newStatus,
            delivery_date: newStatus === 'delivered' ? new Date().toISOString() : d.delivery_date
          }
        : d
    ));

    // Send WhatsApp notification for status updates
    try {
      await WhatsAppDeliveryService.sendDeliveryStatusUpdate({
        customer_phone: delivery.customer_phone,
        customer_name: delivery.customer_name,
        delivery_id: deliveryId,
        status: newStatus,
        driver_name: delivery.assigned_driver,
        vehicle: delivery.assigned_vehicle,
        delivery_address: delivery.delivery_address
      });

      toast({
        title: "Estado actualizado",
        description: `La entrega ha sido marcada como ${newStatus} y el cliente notificado por WhatsApp`,
      });
    } catch (error) {
      toast({
        title: "Estado actualizado",
        description: `La entrega ha sido marcada como ${newStatus}`,
      });
    }
  };

  const handleSendDeliveryReminder = async (delivery: Delivery) => {
    try {
      await WhatsAppDeliveryService.sendDeliveryReminder({
        customer_phone: delivery.customer_phone,
        customer_name: delivery.customer_name,
        delivery_id: delivery.id,
        status: delivery.status,
        driver_name: delivery.assigned_driver,
        vehicle: delivery.assigned_vehicle,
        estimated_time: "2-4 horas",
        delivery_address: delivery.delivery_address
      });

      toast({
        title: "Recordatorio enviado",
        description: "Se ha enviado un recordatorio de entrega por WhatsApp",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el recordatorio",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: Delivery['status']) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Pendiente', icon: Clock },
      assigned: { variant: 'default' as const, label: 'Asignada', icon: User },
      in_transit: { variant: 'default' as const, label: 'En Tránsito', icon: Truck },
      delivered: { variant: 'default' as const, label: 'Entregada', icon: CheckCircle },
      failed: { variant: 'destructive' as const, label: 'Fallida', icon: XCircle }
    };
    
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Gestión de Entregas</h1>
            <p className="text-muted-foreground">Control y seguimiento de entregas con WhatsApp</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            WhatsApp Tracking
          </Badge>
          
          <Dialog open={isNewDeliveryOpen} onOpenChange={setIsNewDeliveryOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Entrega
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Programar Nueva Entrega</DialogTitle>
              </DialogHeader>
              {/* New delivery form would go here */}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entregas</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeliveries}</div>
            <p className="text-xs text-muted-foreground">Todas las entregas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDeliveries}</div>
            <p className="text-xs text-muted-foreground">Por asignar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Tránsito</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inTransitDeliveries}</div>
            <p className="text-xs text-muted-foreground">En camino</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entregadas Hoy</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveredToday}</div>
            <p className="text-xs text-muted-foreground">Completadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="deliveries">Entregas</TabsTrigger>
          <TabsTrigger value="routes">Rutas</TabsTrigger>
          <TabsTrigger value="drivers">Conductores</TabsTrigger>
          <TabsTrigger value="vehicles">Vehículos</TabsTrigger>
        </TabsList>

        <TabsContent value="deliveries" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cliente o dirección..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="assigned">Asignadas</SelectItem>
                <SelectItem value="in_transit">En Tránsito</SelectItem>
                <SelectItem value="delivered">Entregadas</SelectItem>
                <SelectItem value="failed">Fallidas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Deliveries Table */}
          <Card>
            <CardHeader>
              <CardTitle>Entregas Programadas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Conductor</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{delivery.customer_name}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {delivery.customer_phone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{delivery.delivery_address}</span>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(delivery.scheduled_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {delivery.assigned_driver || (
                          <Badge variant="outline">Sin asignar</Badge>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                      <TableCell>${delivery.total_amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          {delivery.status === 'pending' && (
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                          )}
                          {delivery.status === 'assigned' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleUpdateDeliveryStatus(delivery.id, 'in_transit')}
                            >
                              <Truck className="h-3 w-3" />
                            </Button>
                          )}
                          {delivery.status === 'in_transit' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleUpdateDeliveryStatus(delivery.id, 'delivered')}
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleSendDeliveryReminder(delivery)}
                            className="text-green-600"
                          >
                            <MessageCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.map((route) => (
              <Card key={route.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    {route.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Conductor:</span>
                      <span className="text-sm font-medium">{route.driver}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Vehículo:</span>
                      <span className="text-sm font-medium">{route.vehicle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Entregas:</span>
                      <Badge variant="outline">{route.deliveries}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tiempo Est.:</span>
                      <span className="text-sm font-medium">{route.estimatedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Estado:</span>
                      <Badge variant={route.status === 'active' ? 'default' : 'secondary'}>
                        {route.status === 'active' ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="drivers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drivers.map((driver) => (
              <Card key={driver.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {driver.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Teléfono:</span>
                      <span className="text-sm font-medium">{driver.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Licencia:</span>
                      <span className="text-sm font-medium">{driver.license}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    {vehicle.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Capacidad:</span>
                      <span className="text-sm font-medium">{vehicle.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Estado:</span>
                      <Badge variant={vehicle.status === 'available' ? 'default' : 'secondary'}>
                        {vehicle.status === 'available' ? 'Disponible' : 'Mantenimiento'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeliveryModule;
