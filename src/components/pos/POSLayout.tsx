
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  Minus, 
  X, 
  Calculator,
  User,
  Package,
  DollarSign,
  CreditCard,
  ArrowLeft,
  Settings
} from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCustomers } from "@/hooks/useCustomers";
import { useSales } from "@/hooks/useSales";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/hooks/useProducts";
import { Customer } from "@/hooks/useCustomers";
import EnhancedShoppingCart from "./EnhancedShoppingCart";
import PaymentPanel from "./PaymentPanel";
import DailyOperationsDialog from "./DailyOperationsDialog";
import AlexDeyAssistant from "./AlexDeyAssistant";

interface CartItem {
  id: string;
  code: string;
  name: string;
  price: number;
  quantity: number;
  discount?: number;
  priceScale?: string;
}

const POSLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [dailyOperationsOpen, setDailyOperationsOpen] = useState(false);
  
  const { products, loading: productsLoading } = useProducts();
  const { customers, loading: customersLoading } = useCustomers();
  const { createSale } = useSales();
  const { toast } = useToast();

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        id: product.id,
        code: product.code,
        name: product.name,
        price: product.price,
        quantity: 1
      }];
    });
  };

  const updateCartItem = (itemId: string, updates: Partial<CartItem>) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const applyGlobalDiscount = (discount: number, type: 'percentage' | 'fixed') => {
    // This would be handled by the parent component in a real implementation
    console.log('Apply global discount:', discount, type);
  };

  const handleCompleteSale = async (paymentData: any) => {
    try {
      // Create sale items from cart
      const saleItems = cartItems.map(item => ({
        product_id: item.id,
        product_code: item.code,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }));

      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      const saleData = {
        sale_number: `SALE-${Date.now()}`,
        customer_id: selectedCustomer?.id || null,
        subtotal: subtotal,
        tax_amount: 0,
        discount_amount: paymentData.discount || 0,
        total_amount: subtotal - (paymentData.discount || 0),
        payment_method: paymentData.method,
        status: "completed" as const,
        delivery_required: false,
        payment_details: paymentData,
        exchange_rate: paymentData.exchangeRate || 1,
        voucher_used: paymentData.voucherUsed || 0,
        credit_applied: paymentData.creditApplied || 0,
        sale_date: new Date().toISOString()
      };

      await createSale(saleData, saleItems);
      
      // Clear cart and reset
      setCartItems([]);
      setSelectedCustomer(null);
      setShowPayment(false);
      
      toast({
        title: "Venta completada",
        description: "La venta se ha procesado exitosamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Error al procesar la venta: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleGenerateQuote = (notes: string) => {
    toast({
      title: "Cotización generada",
      description: "La cotización ha sido enviada al cliente",
    });
  };

  const handleSendToCredit = (reference: string) => {
    toast({
      title: "Enviado a crédito",
      description: "La venta ha sido enviada al módulo de crédito",
    });
  };

  const handleSuggestion = (suggestion: any) => {
    toast({
      title: "Sugerencia aplicada",
      description: suggestion.title,
    });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <header className="bg-card border-b shadow-soft px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => window.location.href = '/'}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <ShoppingCart className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Punto de Venta</h1>
              <p className="text-sm text-muted-foreground">Sistema POS con Alex Dey AI</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setDailyOperationsOpen(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Operaciones Diarias
            </Button>
            <Badge variant="secondary">
              Items: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </Badge>
            <Badge variant="outline">
              Total: ${subtotal.toFixed(2)}
            </Badge>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="products">Productos</TabsTrigger>
              <TabsTrigger value="customers">Clientes</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-4 h-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto h-[calc(100vh-200px)]">
                {productsLoading ? (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">Cargando productos...</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No se encontraron productos</p>
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium truncate">{product.name}</h3>
                          <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
                            {product.stock}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{product.description || product.code}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">
                            ${product.price.toFixed(2)}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => addToCart(product)}
                            disabled={product.stock === 0}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="customers" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customersLoading ? (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">Cargando clientes...</p>
                  </div>
                ) : customers.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No hay clientes registrados</p>
                  </div>
                ) : (
                  customers.map((customer) => (
                    <Card 
                      key={customer.id} 
                      className={`cursor-pointer hover:shadow-md transition-shadow ${
                        selectedCustomer?.id === customer.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{customer.name}</h3>
                          <Badge variant={customer.customer_type === 'vip' ? 'default' : 'secondary'}>
                            {customer.customer_type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{customer.phone}</p>
                        <p className="text-sm text-primary font-medium">
                          ${customer.total_spent.toFixed(2)} gastado
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar */}
        <div className="w-96 border-l bg-card">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Carrito de Compras</h2>
            {selectedCustomer && (
              <div className="mt-2 p-2 bg-muted rounded">
                <p className="text-sm font-medium">{selectedCustomer.name}</p>
                <p className="text-xs text-muted-foreground">{selectedCustomer.phone}</p>
              </div>
            )}
          </div>

          <div className="h-[calc(100vh-300px)] overflow-y-auto">
            <EnhancedShoppingCart
              items={cartItems}
              onUpdateItem={updateCartItem}
              onRemoveItem={removeFromCart}
              onClearCart={clearCart}
              selectedCustomer={selectedCustomer}
              onApplyDiscount={applyGlobalDiscount}
            />
          </div>

          <div className="p-4 border-t">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">${subtotal.toFixed(2)}</span>
              </div>
            </div>
            
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => setShowPayment(true)}
              disabled={cartItems.length === 0}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Procesar Pago
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <PaymentPanel
              total={subtotal}
              selectedCustomer={selectedCustomer}
              onChargeSale={handleCompleteSale}
              onGenerateQuote={handleGenerateQuote}
              onSendToCredit={handleSendToCredit}
            />
            <Button 
              variant="ghost" 
              onClick={() => setShowPayment(false)}
              className="mt-4 w-full"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Daily Operations Dialog */}
      <DailyOperationsDialog
        open={dailyOperationsOpen}
        onOpenChange={setDailyOperationsOpen}
      />

      {/* Alex Dey Assistant */}
      <div className="fixed bottom-4 right-4 z-40">
        <AlexDeyAssistant
          cartItems={cartItems}
          selectedCustomer={selectedCustomer}
          onSuggestion={handleSuggestion}
        />
      </div>
    </div>
  );
};

export default POSLayout;
