
import { useState } from "react";
import Navigation from "@/components/navigation/Navigation";
import POSLayout from "@/components/pos/POSLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";
import CRMDashboard from "@/components/crm/CRMDashboard";
import InventoryDashboard from "@/components/inventory/InventoryDashboard";
import ReportingDashboard from "@/components/reports/ReportingDashboard";
import CreditsModule from "@/components/credits/CreditsModule";
import SuperGaboModule from "@/components/super-gabo/SuperGaboModule";
import DeliveryModule from "@/components/delivery/DeliveryModule";
import WhatsAppModule from "@/components/whatsapp/WhatsAppModule";
import { useGlobalHotkeys } from "@/hooks/useGlobalHotkeys";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [activeModule, setActiveModule] = useState("navigation");
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Enable global hotkeys
  useGlobalHotkeys({ 
    onModuleChange: setActiveModule, 
    currentModule: activeModule 
  });

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/auth');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // Show auth required message if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">FerreSmart System</h1>
          <p className="text-muted-foreground mb-6">
            Necesitas iniciar sesión para acceder al sistema
          </p>
          <Button 
            onClick={() => navigate('/auth')}
            className="w-full"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Iniciar Sesión
          </Button>
        </div>
      </div>
    );
  }

  const renderModule = () => {
    switch (activeModule) {
      case "pos":
        return <POSLayout />;
      case "admin":
        return <AdminDashboard onBack={() => setActiveModule("navigation")} />;
      case "crm":
        return <CRMDashboard onBack={() => setActiveModule("navigation")} />;
      case "inventory":
        return <InventoryDashboard onBack={() => setActiveModule("navigation")} />;
      case "delivery":
        return <DeliveryModule onBack={() => setActiveModule("navigation")} />;
      case "whatsapp":
        return <WhatsAppModule onBack={() => setActiveModule("navigation")} />;
      case "reports":
        return <ReportingDashboard onBack={() => setActiveModule("navigation")} />;
      case "credits":
        return <CreditsModule onBack={() => setActiveModule("navigation")} />;
      case "super-gabo":
        return <SuperGaboModule onBack={() => setActiveModule("navigation")} />;
      case "navigation":
      default:
        return (
          <div className="relative">
            <div className="absolute top-4 right-4 z-10">
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
            <Navigation 
              activeModule={activeModule} 
              onModuleChange={setActiveModule} 
            />
          </div>
        );
    }
  };

  return renderModule();
};

export default Index;
