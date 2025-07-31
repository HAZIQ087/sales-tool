
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DollarSign, CreditCard, Receipt, AlertCircle } from "lucide-react";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";

interface CreditPaymentFormProps {
  account: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const CreditPaymentForm = ({ account, onSubmit, onCancel }: CreditPaymentFormProps) => {
  const [formData, setFormData] = useState({
    amount: '',
    payment_method: '',
    reference: '',
    notes: '',
    apply_interest: false
  });

  const { paymentMethods } = usePaymentMethods();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: Number(formData.amount)
    });
  };

  const maxPayment = account.current_balance;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Registrar Pago
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Cliente:</span>
              <span>{account.customer_name}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Saldo Actual:</span>
              <Badge variant="destructive">
                ${account.current_balance.toLocaleString()}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Límite:</span>
              <span>${account.credit_limit.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Monto del Pago</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
                className="pl-10"
                max={maxPayment}
                step="0.01"
                required
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Máximo: ${maxPayment.toLocaleString()}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_method">Método de Pago</Label>
            <Select 
              value={formData.payment_method} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar método" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map(method => (
                  <SelectItem key={method.id} value={method.id}>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      {method.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Referencia</Label>
            <Input
              id="reference"
              value={formData.reference}
              onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
              placeholder="Número de referencia o folio"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Notas adicionales..."
              rows={2}
            />
          </div>

          {account.current_balance > account.credit_limit * 0.8 && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                Cuenta cerca del límite de crédito
              </span>
            </div>
          )}

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Registrar Pago
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreditPaymentForm;
