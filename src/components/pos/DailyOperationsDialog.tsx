
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDailyOperations } from '@/hooks/useDailyOperations';
import { DollarSign, Clock, Lock } from 'lucide-react';

interface DailyOperationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DailyOperationsDialog: React.FC<DailyOperationsDialogProps> = ({
  open,
  onOpenChange
}) => {
  const [openingCashMxn, setOpeningCashMxn] = useState(0);
  const [openingCashUsd, setOpeningCashUsd] = useState(0);
  const [closingCashMxn, setClosingCashMxn] = useState(0);
  const [closingCashUsd, setClosingCashUsd] = useState(0);
  
  const { currentOperation, openDailyOperation, closeDailyOperation } = useDailyOperations();

  const handleOpenOperation = async () => {
    await openDailyOperation(openingCashMxn, openingCashUsd);
    onOpenChange(false);
  };

  const handleCloseOperation = async () => {
    await closeDailyOperation(closingCashMxn, closingCashUsd);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Operaciones Diarias
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!currentOperation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Abrir Operación Diaria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Efectivo Inicial MXN</Label>
                    <Input
                      type="number"
                      value={openingCashMxn}
                      onChange={(e) => setOpeningCashMxn(Number(e.target.value))}
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label>Efectivo Inicial USD</Label>
                    <Input
                      type="number"
                      value={openingCashUsd}
                      onChange={(e) => setOpeningCashUsd(Number(e.target.value))}
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <Button onClick={handleOpenOperation} className="w-full">
                  Abrir Operación
                </Button>
              </CardContent>
            </Card>
          )}

          {currentOperation && currentOperation.status === 'open' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Cerrar Operación Diaria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <Label className="text-sm">Efectivo Inicial MXN</Label>
                    <p className="text-lg font-semibold">${currentOperation.opening_cash_mxn.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <Label className="text-sm">Efectivo Inicial USD</Label>
                    <p className="text-lg font-semibold">${currentOperation.opening_cash_usd.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Efectivo Final MXN</Label>
                    <Input
                      type="number"
                      value={closingCashMxn}
                      onChange={(e) => setClosingCashMxn(Number(e.target.value))}
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label>Efectivo Final USD</Label>
                    <Input
                      type="number"
                      value={closingCashUsd}
                      onChange={(e) => setClosingCashUsd(Number(e.target.value))}
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <Button onClick={handleCloseOperation} variant="destructive" className="w-full">
                  Cerrar Operación (Corte Z)
                </Button>
              </CardContent>
            </Card>
          )}

          {currentOperation && currentOperation.status === 'closed' && (
            <Card>
              <CardHeader>
                <CardTitle>Operación Cerrada</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <Label className="text-sm">Efectivo Inicial MXN</Label>
                    <p className="text-lg font-semibold">${currentOperation.opening_cash_mxn.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <Label className="text-sm">Efectivo Inicial USD</Label>
                    <p className="text-lg font-semibold">${currentOperation.opening_cash_usd.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <Label className="text-sm">Efectivo Final MXN</Label>
                    <p className="text-lg font-semibold">${currentOperation.closing_cash_mxn?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <Label className="text-sm">Efectivo Final USD</Label>
                    <p className="text-lg font-semibold">${currentOperation.closing_cash_usd?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DailyOperationsDialog;
