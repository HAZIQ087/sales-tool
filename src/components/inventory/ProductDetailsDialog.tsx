import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/hooks/useProducts";
import { Category } from "@/hooks/useCategories";
import { Supplier } from "@/hooks/useSuppliers";
import { Package, Edit, Trash2, Save, X } from "lucide-react";

interface ProductDetailsDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Product>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  categories: Category[];
  suppliers: Supplier[];
}

export const ProductDetailsDialog = ({
  product,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  categories,
  suppliers
}: ProductDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});

  const handleEdit = () => {
    if (product) {
      setFormData(product);
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (product && formData) {
      try {
        await onUpdate(product.id, formData);
        setIsEditing(false);
        onClose();
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (product && confirm(`¿Estás seguro de eliminar el producto "${product.name}"?`)) {
      try {
        await onDelete(product.id);
        onClose();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { label: 'Agotado', variant: 'destructive' as const };
    if (stock <= minStock) return { label: 'Stock Bajo', variant: 'secondary' as const };
    return { label: 'En Stock', variant: 'default' as const };
  };

  if (!product) return null;

  const stockStatus = getStockStatus(product.stock, product.min_stock);
  const categoryName = categories.find(c => c.id === product.category_id)?.name || 'Sin categoría';
  const supplierName = suppliers.find(s => s.id === product.supplier_id)?.name || 'Sin proveedor';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {isEditing ? 'Editar Producto' : 'Detalles del Producto'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!isEditing ? (
            // View Mode
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Código</Label>
                  <p className="text-lg font-mono">{product.code}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Estado</Label>
                  <div className="mt-1">
                    <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Nombre</Label>
                <p className="text-lg">{product.name}</p>
              </div>

              {product.description && (
                <div>
                  <Label className="text-sm font-medium">Descripción</Label>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Categoría</Label>
                  <p>{categoryName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Proveedor</Label>
                  <p>{supplierName}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Precio</Label>
                  <p className="text-xl font-bold text-primary">
                    ${Number(product.price).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Stock Actual</Label>
                  <p className="text-xl font-bold">{product.stock}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Stock Mínimo</Label>
                  <p className="text-xl">{product.min_stock}</p>
                </div>
              </div>

              {product.location && (
                <div>
                  <Label className="text-sm font-medium">Ubicación</Label>
                  <p>{product.location}</p>
                </div>
              )}

              {product.barcode && (
                <div>
                  <Label className="text-sm font-medium">Código de Barras</Label>
                  <p className="font-mono">{product.barcode}</p>
                </div>
              )}

              <Separator />

              <div className="flex justify-between pt-4">
                <div className="space-x-2">
                  <Button onClick={handleEdit} variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button onClick={handleDelete} variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
                <Button onClick={onClose} variant="secondary">
                  Cerrar
                </Button>
              </div>
            </>
          ) : (
            // Edit Mode
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Código</Label>
                  <Input
                    id="code"
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={formData.status || ''}
                    onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'inactive' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Categoría</Label>
                  <Select
                    value={formData.category_id || ''}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="supplier">Proveedor</Label>
                  <Select
                    value={formData.supplier_id || ''}
                    onValueChange={(value) => setFormData({ ...formData, supplier_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Precio</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock Actual</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock || ''}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="min_stock">Stock Mínimo</Label>
                  <Input
                    id="min_stock"
                    type="number"
                    value={formData.min_stock || ''}
                    onChange={(e) => setFormData({ ...formData, min_stock: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Ubicación</Label>
                  <Input
                    id="location"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="barcode">Código de Barras</Label>
                  <Input
                    id="barcode"
                    value={formData.barcode || ''}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex justify-between pt-4">
                <Button onClick={handleCancel} variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <div className="space-x-2">
                  <Button onClick={handleSave} variant="default">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};