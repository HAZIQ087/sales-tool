import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  Search,
  Filter,
  Plus,
  ArrowLeft,
  Barcode,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Archive,
  Edit,
  Eye,
  Download
} from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useSuppliers } from "@/hooks/useSuppliers";
import { ProductForm } from "@/components/forms/ProductForm";
import { ProductDetailsDialog } from "./ProductDetailsDialog";

interface InventoryDashboardProps {
  onBack: () => void;
}

const InventoryDashboard = ({ onBack }: InventoryDashboardProps) => {
  const [activeTab, setActiveTab] = useState("products");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { products, loading: productsLoading, updateProduct, deleteProduct } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { suppliers } = useSuppliers();

  // Calculate inventory stats from real data
  const inventoryStats = useMemo(() => {
    const total = products.length;
    const lowStock = products.filter(p => p.stock <= p.min_stock && p.stock > 0).length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    return { 
      total, 
      lowStock, 
      outOfStock, 
      totalValue: Math.round(totalValue / 1000) // Convert to thousands
    };
  }, [products]);

  // Format products with status
  const formattedProducts = useMemo(() => {
    return products.map(product => ({
      ...product,
      status: product.stock === 0 ? 'Agotado' : 
              product.stock <= product.min_stock ? 'Stock Bajo' : 'Activo'
    }));
  }, [products]);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return formattedProducts;
    return formattedProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [formattedProducts, searchQuery]);

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setIsProductDialogOpen(true);
  };

  const handleProductUpdate = async (id: string, updates: any) => {
    await updateProduct(id, updates);
  };

  const handleProductDelete = async (id: string) => {
    await deleteProduct(id);
  };

  // Sample movements data (you can create a useMovements hook later)
  const movements = [
    {
      id: "MOV001",
      product: "Cemento Portland 50kg",
      type: "Entrada",
      quantity: 50,
      date: "2024-01-15",
      reason: "Compra a proveedor",
      user: "Juan Admin"
    },
    {
      id: "MOV002", 
      product: "Varilla 3/8\" x 12m",
      type: "Salida",
      quantity: 7,
      date: "2024-01-15",
      reason: "Venta a cliente",
      user: "María Vendedor"
    }
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
            <Package className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Gestión de Inventario</h1>
              <p className="text-sm text-muted-foreground">Control completo de productos y stock</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <ProductForm />
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="categories">Categorías</TabsTrigger>
            <TabsTrigger value="kardex">Kardex</TabsTrigger>
            <TabsTrigger value="barcode">Códigos de Barra</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Productos</p>
                      <p className="text-2xl font-bold text-primary">{inventoryStats.total}</p>
                    </div>
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Stock Bajo</p>
                      <p className="text-2xl font-bold text-destructive">{inventoryStats.lowStock}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Agotados</p>
                      <p className="text-2xl font-bold text-red-600">{inventoryStats.outOfStock}</p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                      <p className="text-2xl font-bold text-secondary">${inventoryStats.totalValue}K</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-secondary" />
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
                    <Input 
                      placeholder="Buscar por código, nombre o categoría..." 
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                  <Button variant="outline">
                    <Barcode className="h-4 w-4 mr-2" />
                    Escanear
                  </Button>
                </div>

                {/* Product List */}
                <div className="space-y-4">
                  {productsLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Cargando productos...</p>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-16 w-16 mx-auto mb-4" />
                      <p>No hay productos registrados</p>
                      <p className="text-sm">Agrega tu primer producto con el botón "Nuevo Producto"</p>
                    </div>
                  ) : (
                    filteredProducts.map((product) => (
                    <div key={product.code} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{product.name}</h4>
                            <Badge 
                              variant={
                                product.status === 'Agotado' ? 'destructive' :
                                product.status === 'Stock Bajo' ? 'secondary' : 'outline'
                              }
                            >
                              {product.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Código: {product.code} • {product.location || 'Sin ubicación'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            <span className={
                              product.stock === 0 ? 'text-red-600' :
                              product.stock <= product.min_stock ? 'text-destructive' : 'text-foreground'
                            }>
                              {product.stock}
                            </span>
                            <span className="text-sm text-muted-foreground"> uds</span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Mín: {product.min_stock}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">${product.price}</p>
                          <p className="text-sm text-muted-foreground">c/u</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleProductClick(product)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              const newPrice = prompt("Nuevo precio:", product.price.toString());
                              if (newPrice && !isNaN(Number(newPrice))) {
                                updateProduct(product.id, { price: Number(newPrice) });
                              }
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              if (confirm(`¿Eliminar producto ${product.name}?`)) {
                                deleteProduct(product.id);
                              }
                            }}
                          >
                            <Barcode className="h-4 w-4" />
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

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Categorías de Productos</CardTitle>
              </CardHeader>
              <CardContent>
                {categoriesLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Cargando categorías...</p>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Archive className="h-16 w-16 mx-auto mb-4" />
                    <p>No hay categorías registradas</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{category.name}</h4>
                        <Archive className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Productos:</span>
                          <span className="font-medium">{products.filter(p => p.category_id === category.id).length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Productos:</span>
                          <span className="font-medium">
                            {products.filter(p => p.category_id === category.id).length}
                          </span>
                        </div>
                      </div>
                    </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Kardex Tab */}
          <TabsContent value="kardex" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Archive className="h-5 w-5" />
                  Kardex - Movimientos de Inventario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {movements.map((movement) => (
                    <div key={movement.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${
                          movement.type === 'Entrada' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <h4 className="font-medium">{movement.product}</h4>
                          <p className="text-sm text-muted-foreground">
                            {movement.reason} • {movement.user}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Badge variant={movement.type === 'Entrada' ? 'secondary' : 'destructive'}>
                            {movement.type}
                          </Badge>
                          <span className="font-bold">
                            {movement.type === 'Entrada' ? '+' : '-'}{movement.quantity}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{movement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Barcode Tab */}
          <TabsContent value="barcode" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Barcode className="h-5 w-5" />
                  Generador de Códigos de Barra
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Barcode className="h-16 w-16 mx-auto mb-4" />
                  <p>Generador de códigos de barra en desarrollo</p>
                  <p className="text-sm">Generación automática y impresión de etiquetas</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <ProductDetailsDialog
          product={selectedProduct}
          isOpen={isProductDialogOpen}
          onClose={() => {
            setIsProductDialogOpen(false);
            setSelectedProduct(null);
          }}
          onUpdate={handleProductUpdate}
          onDelete={handleProductDelete}
          categories={categories}
          suppliers={suppliers}
        />
      </div>
    </div>
  );
};

export default InventoryDashboard;