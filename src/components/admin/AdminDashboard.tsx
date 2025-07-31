import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useSuppliers } from "@/hooks/useSuppliers";
import { ProductForm } from "@/components/forms/ProductForm";
import { ProductDetailsDialog } from "@/components/inventory/ProductDetailsDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Building2,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  Clock,
  DollarSign,
  ShoppingCart,
  Truck,
  ArrowLeft,
  Download,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  Plus
} from "lucide-react";

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard = ({ onBack }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);
  const { products, loading: productsLoading, createProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();
  const { suppliers } = useSuppliers();

  // Sample data
  const todaysStats = {
    sales: 45230,
    orders: 23,
    customers: 156,
    inventory: 89
  };

  const recentSales = [
    { id: "001", customer: "Juan Pérez", amount: 2500, items: 5, time: "10:30 AM" },
    { id: "002", customer: "María García", amount: 1800, items: 3, time: "11:15 AM" },
    { id: "003", customer: "Carlos López", amount: 3200, items: 8, time: "12:45 PM" },
  ];

  const lowStockItems = [
    { code: "CEM001", name: "Cemento Portland 50kg", stock: 5, min: 20 },
    { code: "VAR012", name: "Varilla 3/8\" x 12m", stock: 8, min: 15 },
    { code: "BLK003", name: "Block 15x20x40", stock: 12, min: 50 },
  ];

  const branches = [
    { name: "Sucursal Centro", sales: 25430, orders: 15, status: "Activa" },
    { name: "Sucursal Norte", sales: 19800, orders: 8, status: "Activa" },
  ];

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <header className="bg-card border-b shadow-soft px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Panel Administrativo</h1>
              <p className="text-sm text-muted-foreground">Gestión completa del negocio</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Badge variant="secondary">Administrador</Badge>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="inventory">Inventario</TabsTrigger>
            <TabsTrigger value="sales">Ventas</TabsTrigger>
            <TabsTrigger value="staff">Personal</TabsTrigger>
            <TabsTrigger value="branches">Sucursales</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Ventas Hoy</p>
                      <p className="text-2xl font-bold text-primary">
                        ${todaysStats.sales.toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-primary" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600">+12%</span>
                    <span className="text-muted-foreground ml-1">vs ayer</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Órdenes</p>
                      <p className="text-2xl font-bold">{todaysStats.orders}</p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-secondary" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600">+5</span>
                    <span className="text-muted-foreground ml-1">vs ayer</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Clientes</p>
                      <p className="text-2xl font-bold">{todaysStats.customers}</p>
                    </div>
                    <Users className="h-8 w-8 text-accent" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600">+3</span>
                    <span className="text-muted-foreground ml-1">nuevos</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Stock Bajo</p>
                      <p className="text-2xl font-bold text-destructive">{lowStockItems.length}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                  </div>
                  <div className="mt-2">
                    <span className="text-sm text-muted-foreground">productos críticos</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Sales */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Ventas Recientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentSales.map((sale) => (
                      <div key={sale.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium">{sale.customer}</p>
                          <p className="text-sm text-muted-foreground">
                            {sale.items} productos - {sale.time}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">${sale.amount.toLocaleString()}</p>
                          <Badge variant="outline" className="text-xs">#{sale.id}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Low Stock Alert */}
              <Card className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    Productos con Stock Bajo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {lowStockItems.map((item) => (
                      <div key={item.code} className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg border border-destructive/10">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Código: {item.code}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-destructive">{item.stock} unidades</p>
                          <p className="text-xs text-muted-foreground">Mínimo: {item.min}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Ver Todo el Inventario
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Branches Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Rendimiento por Sucursal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {branches.map((branch, index) => (
                    <div key={index} className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{branch.name}</h4>
                        <Badge variant="secondary">{branch.status}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Ventas:</span>
                          <span className="font-medium">${branch.sales.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Órdenes:</span>
                          <span className="font-medium">{branch.orders}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Gestión de Inventario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input placeholder="Buscar productos..." className="pl-10" />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                  <Button onClick={() => setIsProductFormOpen(true)} variant="default">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Producto
                  </Button>
                </div>

                {productsLoading ? (
                  <div className="text-center py-8">
                    <p>Cargando productos...</p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-16 w-16 mx-auto mb-4" />
                    <p>No hay productos registrados</p>
                    <p className="text-sm">Agrega tu primer producto</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.slice(0, 12).map((product) => (
                      <Card 
                        key={product.id} 
                        className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsProductDetailsOpen(true);
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{product.name}</h4>
                          <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                            {product.status === 'active' ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>Código: {product.code}</p>
                          <p>Stock: {product.stock} unidades</p>
                          <p>Precio: ${Number(product.price).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProduct(product);
                              setIsProductDetailsOpen(true);
                            }}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Ver
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProduct(product);
                              setIsProductDetailsOpen(true);
                            }}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sales Tab */}
          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Reportes de Ventas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4" />
                  <p>Módulo de reportes en desarrollo</p>
                  <p className="text-sm">Análisis completo de ventas, ganancias y comisiones</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staff Tab */}
          <TabsContent value="staff" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Gestión de Personal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-16 w-16 mx-auto mb-4" />
                  <p>Módulo de personal en desarrollo</p>
                  <p className="text-sm">Check-in/out, comisiones y rendimiento</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branches Tab */}
          <TabsContent value="branches" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Gestión de Sucursales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="h-16 w-16 mx-auto mb-4" />
                  <p>Módulo de sucursales en desarrollo</p>
                  <p className="text-sm">Gestión multi-sucursal y supervisión global</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isProductFormOpen} onOpenChange={setIsProductFormOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Producto</DialogTitle>
            </DialogHeader>
            <ProductForm onSuccess={() => setIsProductFormOpen(false)} />
          </DialogContent>
        </Dialog>

        {selectedProduct && (
          <ProductDetailsDialog
            product={selectedProduct}
            isOpen={isProductDetailsOpen}
            onClose={() => {
              setIsProductDetailsOpen(false);
              setSelectedProduct(null);
            }}
            onUpdate={async (id, updates) => {
              await updateProduct(id, updates);
            }}
            onDelete={async (id) => {
              await deleteProduct(id);
            }}
            categories={categories}
            suppliers={suppliers}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;