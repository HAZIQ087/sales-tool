import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCustomers } from "@/hooks/useCustomers";
import { useToast } from "@/hooks/use-toast";
import {
  CreditCard,
  Plus,
  ArrowLeft,
  DollarSign,
  Users,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2
} from "lucide-react";

interface CreditsModuleProps {
  onBack: () => void;
}

interface CreditAccount {
  id: string;
  customer_id: string;
  customer_name: string;
  credit_limit: number;
  current_balance: number;
  available_credit: number;
  status: 'active' | 'suspended' | 'closed';
  created_at: string;
  last_payment: string;
  payment_terms: number; // days
}

interface CreditTransaction {
  id: string;
  credit_account_id: string;
  type: 'charge' | 'payment' | 'adjustment';
  amount: number;
  description: string;
  reference: string;
  created_at: string;
  created_by: string;
}

const CreditsModule = ({ onBack }: CreditsModuleProps) => {
  const [activeTab, setActiveTab] = useState("accounts");
  const [isNewAccountOpen, setIsNewAccountOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<CreditAccount | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const { customers } = useCustomers();
  const { toast } = useToast();

  // Mock data - In real app, this would come from your database
  const [creditAccounts, setCreditAccounts] = useState<CreditAccount[]>([
    {
      id: "1",
      customer_id: "cust1",
      customer_name: "Juan Pérez",
      credit_limit: 50000,
      current_balance: 15000,
      available_credit: 35000,
      status: 'active',
      created_at: new Date().toISOString(),
      last_payment: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      payment_terms: 30
    },
    {
      id: "2",
      customer_id: "cust2",
      customer_name: "María González",
      credit_limit: 75000,
      current_balance: 45000,
      available_credit: 30000,
      status: 'active',
      created_at: new Date().toISOString(),
      last_payment: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      payment_terms: 30
    }
  ]);

  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>([
    {
      id: "1",
      credit_account_id: "1",
      type: 'charge',
      amount: 5000,
      description: "Compra de materiales",
      reference: "SALE-001",
      created_at: new Date().toISOString(),
      created_by: "admin"
    },
    {
      id: "2",
      credit_account_id: "1",
      type: 'payment',
      amount: -10000,
      description: "Pago efectivo",
      reference: "PAY-001",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: "admin"
    }
  ]);

  // Calculate statistics
  const totalCreditLimit = creditAccounts.reduce((sum, acc) => sum + acc.credit_limit, 0);
  const totalOutstanding = creditAccounts.reduce((sum, acc) => sum + acc.current_balance, 0);
  const totalAvailable = creditAccounts.reduce((sum, acc) => sum + acc.available_credit, 0);
  const activeAccounts = creditAccounts.filter(acc => acc.status === 'active').length;

  // Filter accounts
  const filteredAccounts = creditAccounts.filter(account => {
    const matchesSearch = account.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || account.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateAccount = (formData: any) => {
    const newAccount: CreditAccount = {
      id: Date.now().toString(),
      customer_id: formData.customer_id,
      customer_name: formData.customer_name,
      credit_limit: Number(formData.credit_limit),
      current_balance: 0,
      available_credit: Number(formData.credit_limit),
      status: 'active',
      created_at: new Date().toISOString(),
      last_payment: new Date().toISOString(),
      payment_terms: Number(formData.payment_terms)
    };

    setCreditAccounts(prev => [...prev, newAccount]);
    setIsNewAccountOpen(false);
    
    toast({
      title: "Cuenta de crédito creada",
      description: `Cuenta creada para ${formData.customer_name} con límite de $${Number(formData.credit_limit).toLocaleString()}`,
    });
  };

  const handlePayment = (accountId: string, amount: number, description: string) => {
    setCreditAccounts(prev => prev.map(acc => 
      acc.id === accountId 
        ? {
            ...acc,
            current_balance: Math.max(0, acc.current_balance - amount),
            available_credit: Math.min(acc.credit_limit, acc.available_credit + amount),
            last_payment: new Date().toISOString()
          }
        : acc
    ));

    const newTransaction: CreditTransaction = {
      id: Date.now().toString(),
      credit_account_id: accountId,
      type: 'payment',
      amount: -amount,
      description: description || "Pago de crédito",
      reference: `PAY-${Date.now()}`,
      created_at: new Date().toISOString(),
      created_by: "admin"
    };

    setCreditTransactions(prev => [...prev, newTransaction]);
    setIsPaymentOpen(false);
    setSelectedAccount(null);

    toast({
      title: "Pago registrado",
      description: `Pago de $${amount.toLocaleString()} aplicado correctamente`,
    });
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
            <h1 className="text-3xl font-bold">Módulo de Créditos</h1>
            <p className="text-muted-foreground">Gestión de cuentas de crédito y pagos</p>
          </div>
        </div>
        
        <Dialog open={isNewAccountOpen} onOpenChange={setIsNewAccountOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Cuenta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Cuenta de Crédito</DialogTitle>
            </DialogHeader>
            <NewAccountForm onSubmit={handleCreateAccount} customers={customers} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Límite Total</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCreditLimit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Crédito autorizado total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Pendiente</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalOutstanding.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Por cobrar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crédito Disponible</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAvailable.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Disponible para uso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cuentas Activas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAccounts}</div>
            <p className="text-xs text-muted-foreground">
              De {creditAccounts.length} totales
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">Cuentas</TabsTrigger>
          <TabsTrigger value="transactions">Transacciones</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cliente..."
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
                <SelectItem value="active">Activas</SelectItem>
                <SelectItem value="suspended">Suspendidas</SelectItem>
                <SelectItem value="closed">Cerradas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Accounts Table */}
          <Card>
            <CardHeader>
              <CardTitle>Cuentas de Crédito</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Límite</TableHead>
                    <TableHead>Saldo</TableHead>
                    <TableHead>Disponible</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{account.customer_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Términos: {account.payment_terms} días
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>${account.credit_limit.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={account.current_balance > account.credit_limit * 0.8 ? "text-red-600" : ""}>
                          ${account.current_balance.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>${account.available_credit.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={
                          account.status === 'active' ? 'default' : 
                          account.status === 'suspended' ? 'destructive' : 'secondary'
                        }>
                          {account.status === 'active' ? 'Activa' : 
                           account.status === 'suspended' ? 'Suspendida' : 'Cerrada'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedAccount(account);
                              setIsPaymentOpen(true);
                            }}
                          >
                            Pago
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
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

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Transacciones</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Referencia</TableHead>
                    <TableHead>Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creditTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          transaction.type === 'payment' ? 'default' : 
                          transaction.type === 'charge' ? 'destructive' : 'secondary'
                        }>
                          {transaction.type === 'payment' ? 'Pago' : 
                           transaction.type === 'charge' ? 'Cargo' : 'Ajuste'}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className="font-mono text-sm">{transaction.reference}</TableCell>
                      <TableCell className={transaction.amount < 0 ? "text-green-600" : "text-red-600"}>
                        ${Math.abs(transaction.amount).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Edad de Saldos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>0-30 días</span>
                    <span className="font-semibold">$25,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>31-60 días</span>
                    <span className="font-semibold">$15,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>61-90 días</span>
                    <span className="font-semibold text-yellow-600">$8,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>+90 días</span>
                    <span className="font-semibold text-red-600">$12,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Utilización de Crédito</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Promedio de utilización</span>
                    <span className="font-semibold">65%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cuentas sobre límite</span>
                    <span className="font-semibold text-red-600">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pagos a tiempo</span>
                    <span className="font-semibold text-green-600">85%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Payment Dialog */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Pago</DialogTitle>
          </DialogHeader>
          {selectedAccount && (
            <PaymentForm 
              account={selectedAccount} 
              onSubmit={(amount, description) => handlePayment(selectedAccount.id, amount, description)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// New Account Form Component
const NewAccountForm = ({ onSubmit, customers }: { onSubmit: (data: any) => void, customers: any[] }) => {
  const [formData, setFormData] = useState({
    customer_id: '',
    customer_name: '',
    credit_limit: '',
    payment_terms: '30'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ customer_id: '', customer_name: '', credit_limit: '', payment_terms: '30' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="customer">Cliente</Label>
        <Select 
          value={formData.customer_id} 
          onValueChange={(value) => {
            const customer = customers.find(c => c.id === value);
            setFormData(prev => ({
              ...prev,
              customer_id: value,
              customer_name: customer?.name || ''
            }));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar cliente" />
          </SelectTrigger>
          <SelectContent>
            {customers.map(customer => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="credit_limit">Límite de Crédito</Label>
        <Input
          id="credit_limit"
          type="number"
          value={formData.credit_limit}
          onChange={(e) => setFormData(prev => ({ ...prev, credit_limit: e.target.value }))}
          placeholder="50000"
          required
        />
      </div>

      <div>
        <Label htmlFor="payment_terms">Términos de Pago (días)</Label>
        <Select 
          value={formData.payment_terms} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, payment_terms: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15">15 días</SelectItem>
            <SelectItem value="30">30 días</SelectItem>
            <SelectItem value="45">45 días</SelectItem>
            <SelectItem value="60">60 días</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        Crear Cuenta
      </Button>
    </form>
  );
};

// Payment Form Component
const PaymentForm = ({ account, onSubmit }: { account: CreditAccount, onSubmit: (amount: number, description: string) => void }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(Number(amount), description);
    setAmount('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Cliente: {account.customer_name}</Label>
        <p className="text-sm text-muted-foreground">
          Saldo actual: ${account.current_balance.toLocaleString()}
        </p>
      </div>

      <div>
        <Label htmlFor="amount">Monto del Pago</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          max={account.current_balance}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Concepto del pago..."
        />
      </div>

      <Button type="submit" className="w-full">
        Registrar Pago
      </Button>
    </form>
  );
};

export default CreditsModule;