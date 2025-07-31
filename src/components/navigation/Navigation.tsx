
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Truck, 
  CreditCard,
  MessageSquare,
  Settings,
  Mic,
  Building2,
  Archive
} from "lucide-react";

interface NavigationProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const Navigation = ({ activeModule, onModuleChange }: NavigationProps) => {
  const modules = [
    {
      id: "pos",
      name: "Punto de Venta",
      icon: ShoppingCart,
      description: "POS con asistente de voz",
      color: "primary",
      shortcut: "F1"
    },
    {
      id: "inventory",
      name: "Inventario",
      icon: Package,
      description: "Gestión de productos",
      color: "secondary",
      shortcut: "F2"
    },
    {
      id: "admin",
      name: "Administración",
      icon: Building2,
      description: "Panel administrativo",
      color: "secondary",
      shortcut: "F3"
    },
    {
      id: "crm",
      name: "CRM",
      icon: Users,
      description: "Gestión de clientes",
      color: "secondary",
      shortcut: "F4"
    },
    {
      id: "delivery",
      name: "Entregas",
      icon: Truck,
      description: "Seguimiento de entregas",
      color: "secondary",
      shortcut: "F5"
    },
    {
      id: "credits",
      name: "Créditos",
      icon: CreditCard,
      description: "Créditos y resguardos",
      color: "secondary",
      shortcut: "F6"
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: MessageSquare,
      description: "Ventas automatizadas",
      color: "accent",
      shortcut: "F7"
    },
    {
      id: "reports",
      name: "Reportes",
      icon: BarChart3,
      description: "Elite Meeting Mode",
      color: "secondary",
      shortcut: "F8"
    },
    {
      id: "super-gabo",
      name: "Super Gabo",
      icon: Mic,
      description: "Supervisión global",
      color: "accent",
      shortcut: "F9"
    }
  ];

  const getButtonVariant = (moduleColor: string, isActive: boolean) => {
    if (isActive) return "pos";
    if (moduleColor === "accent") return "outline";
    return "industrial";
  };

  return (
    <div className="p-6 bg-gradient-surface min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Package className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              FerreSmart System
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sistema integral de ventas para ferreterías y materiales de construcción
            con asistente de voz Alex Dey integrado
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="secondary">Versión 1.0</Badge>
            <Badge variant="outline">Modo Offline Disponible</Badge>
            <Badge variant="outline">Voice AI Ready</Badge>
          </div>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const Icon = module.icon;
            const isActive = activeModule === module.id;
            
            return (
              <Card 
                key={module.id} 
                className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-strong ${
                  isActive ? 'ring-2 ring-primary shadow-strong' : 'hover:scale-[1.02]'
                }`}
                onClick={() => onModuleChange(module.id)}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Icon className={`h-8 w-8 ${
                      module.color === 'primary' ? 'text-primary' : 
                      module.color === 'accent' ? 'text-accent' : 'text-secondary'
                    }`} />
                    <Badge variant="outline" className="text-xs">
                      {module.shortcut}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{module.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {module.description}
                    </p>
                  </div>

                  <Button 
                    variant={getButtonVariant(module.color, isActive)}
                    className="w-full"
                    size="lg"
                  >
                    {isActive ? 'Módulo Activo' : 'Acceder'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Voice Assistant Status */}
        <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Mic className="h-8 w-8 text-primary animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Asistente Alex Dey</h3>
                <p className="text-sm text-muted-foreground">
                  Listo para asistir en ventas y entrenamiento
                </p>
              </div>
            </div>
            <Button variant="secondary">
              Configurar Voz
            </Button>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">$45,230</div>
            <div className="text-sm text-muted-foreground">Ventas Hoy</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">156</div>
            <div className="text-sm text-muted-foreground">Productos</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">23</div>
            <div className="text-sm text-muted-foreground">Entregas</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">89%</div>
            <div className="text-sm text-muted-foreground">Satisfacción</div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
