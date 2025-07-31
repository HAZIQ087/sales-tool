
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Minus, Plus, Edit3, Percent, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePriceScales } from '@/hooks/usePriceScales';
import { useCustomers } from '@/hooks/useCustomers';

interface CartItem {
  id: string;
  code: string;
  name: string;
  price: number;
  quantity: number;
  discount?: number;
  priceScale?: string;
}

interface EnhancedShoppingCartProps {
  items: CartItem[];
  onUpdateItem: (itemId: string, updates: Partial<CartItem>) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  selectedCustomer?: any;
  onApplyDiscount: (discount: number, type: 'percentage' | 'fixed') => void;
  globalDiscount?: number;
}

const EnhancedShoppingCart: React.FC<EnhancedShoppingCartProps> = ({
  items,
  onUpdateItem,
  onRemoveItem,
  onClearCart,
  selectedCustomer,
  onApplyDiscount,
  globalDiscount = 0
}) => {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [discountDialog, setDiscountDialog] = useState(false);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(0);
  const { priceScales } = usePriceScales();

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = globalDiscount || 0;
  const total = subtotal - discountAmount;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      onUpdateItem(itemId, { quantity: newQuantity });
    }
  };

  const handlePriceChange = (itemId: string, newPrice: number) => {
    // This would require authorization in a real system
    onUpdateItem(itemId, { price: newPrice });
  };

  const handleItemDiscount = (itemId: string, discount: number) => {
    onUpdateItem(itemId, { discount });
  };

  const applyGlobalDiscount = () => {
    const amount = discountType === 'percentage' 
      ? (subtotal * discountValue) / 100 
      : discountValue;
    onApplyDiscount(amount, discountType);
    setDiscountDialog(false);
    setDiscountValue(0);
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl">Carrito de Compras</CardTitle>
        <div className="flex gap-2">
          <Dialog open={discountDialog} onOpenChange={setDiscountDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Percent className="h-4 w-4" />
                Descuento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Aplicar Descuento Global</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Select value={discountType} onValueChange={(value: 'percentage' | 'fixed') => setDiscountType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Porcentaje</SelectItem>
                    <SelectItem value="fixed">Monto Fijo</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  placeholder={discountType === 'percentage' ? 'Porcentaje' : 'Monto'}
                />
                <Button onClick={applyGlobalDiscount} className="w-full">
                  Aplicar Descuento
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" onClick={onClearCart}>
            <Trash2 className="h-4 w-4" />
            Limpiar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Carrito vacío
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {items.map((item) => (
                <div key={item.id} className="border rounded-lg p-3 bg-background">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.code}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Producto</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Precio</label>
                              <Input
                                type="number"
                                value={item.price}
                                onChange={(e) => handlePriceChange(item.id, Number(e.target.value))}
                                step="0.01"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Descuento</label>
                              <Input
                                type="number"
                                value={item.discount || 0}
                                onChange={(e) => handleItemDiscount(item.id, Number(e.target.value))}
                                step="0.01"
                              />
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <span className="font-medium">
                        ${(item.price * item.quantity - (item.discount || 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  {item.discount && (
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs">
                        Descuento: ${item.discount.toFixed(2)}
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {items.length > 0 && (
          <div className="border-t p-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {globalDiscount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Descuento:</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedShoppingCart;
