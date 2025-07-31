
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreditCard, DollarSign, Receipt, FileText, Send } from 'lucide-react';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { useVouchers } from '@/hooks/useVouchers';

interface PaymentPanelProps {
  total: number;
  selectedCustomer?: any;
  onChargeSale: (paymentData: any) => void;
  onGenerateQuote: (notes: string) => void;
  onSendToCredit: (reference: string) => void;
}

const PaymentPanel: React.FC<PaymentPanelProps> = ({
  total,
  selectedCustomer,
  onChargeSale,
  onGenerateQuote,
  onSendToCredit
}) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(total);
  const [currency, setCurrency] = useState<'MXN' | 'USD'>('MXN');
  const [voucherNumber, setVoucherNumber] = useState('');
  const [creditAmount, setCreditAmount] = useState(0);
  const [quoteNotes, setQuoteNotes] = useState('');
  const [creditReference, setCreditReference] = useState('');
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);
  const [showCreditDialog, setShowCreditDialog] = useState(false);

  const { paymentMethods } = usePaymentMethods();
  const { exchangeRate } = useExchangeRate();
  const { applyVoucher } = useVouchers();

  const convertedAmount = currency === 'USD' && exchangeRate 
    ? (total / exchangeRate.rate).toFixed(2)
    : total.toFixed(2);

  const handlePayment = () => {
    const paymentData = {
      method: paymentMethod,
      amount: paymentAmount,
      currency,
      exchangeRate: exchangeRate?.rate,
      voucherUsed: voucherNumber,
      creditApplied: creditAmount
    };
    onChargeSale(paymentData);
  };

  const handleApplyVoucher = async () => {
    if (!voucherNumber) return;
    
    try {
      const voucher = await applyVoucher(voucherNumber, Math.min(total, paymentAmount));
      setCreditAmount(voucher.amount - voucher.used_amount);
    } catch (error) {
      console.error('Error applying voucher:', error);
    }
  };

  const handleGenerateQuote = () => {
    onGenerateQuote(quoteNotes);
    setShowQuoteDialog(false);
    setQuoteNotes('');
  };

  const handleSendToCredit = () => {
    onSendToCredit(creditReference);
    setShowCreditDialog(false);
    setCreditReference('');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Panel de Pago
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Currency Selection */}
        <div className="space-y-2">
          <Label>Moneda</Label>
          <Select value={currency} onValueChange={(value: 'MXN' | 'USD') => setCurrency(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
              <SelectItem value="USD">USD - Dólar Americano</SelectItem>
            </SelectContent>
          </Select>
          {currency === 'USD' && exchangeRate && (
            <p className="text-sm text-muted-foreground">
              Tipo de cambio: ${exchangeRate.rate.toFixed(2)} MXN
            </p>
          )}
        </div>

        {/* Total Display */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Total a Pagar:</span>
            <span className="text-2xl font-bold">
              {currency} ${convertedAmount}
            </span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-2">
          <Label>Método de Pago</Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar método" />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods
                .filter(method => method.currency === currency)
                .map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    {method.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Payment Amount */}
        <div className="space-y-2">
          <Label>Monto a Pagar</Label>
          <Input
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(Number(e.target.value))}
            step="0.01"
          />
        </div>

        {/* Customer Credit */}
        {selectedCustomer && (
          <div className="space-y-2">
            <Label>Crédito del Cliente</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Número de vale"
                value={voucherNumber}
                onChange={(e) => setVoucherNumber(e.target.value)}
              />
              <Button onClick={handleApplyVoucher} variant="outline">
                Aplicar
              </Button>
            </div>
            {creditAmount > 0 && (
              <Badge variant="secondary">
                Crédito disponible: ${creditAmount.toFixed(2)}
              </Badge>
            )}
          </div>
        )}

        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={handlePayment}
            className="w-full py-6 text-lg"
            disabled={!paymentMethod}
          >
            <Receipt className="h-5 w-5 mr-2" />
            Cobrar Venta
          </Button>

          <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full py-4">
                <FileText className="h-5 w-5 mr-2" />
                Generar Cotización
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generar Cotización</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Notas</Label>
                  <Input
                    value={quoteNotes}
                    onChange={(e) => setQuoteNotes(e.target.value)}
                    placeholder="Notas adicionales..."
                  />
                </div>
                <Button onClick={handleGenerateQuote} className="w-full">
                  Generar Cotización
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showCreditDialog} onOpenChange={setShowCreditDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full py-4">
                <Send className="h-5 w-5 mr-2" />
                Enviar a Crédito
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enviar a Crédito</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Referencia</Label>
                  <Input
                    value={creditReference}
                    onChange={(e) => setCreditReference(e.target.value)}
                    placeholder="Referencia del crédito..."
                  />
                </div>
                <Button onClick={handleSendToCredit} className="w-full">
                  Enviar a Crédito
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentPanel;
