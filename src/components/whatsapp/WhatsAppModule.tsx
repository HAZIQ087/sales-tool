
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  MessageCircle, 
  Send, 
  Phone, 
  User, 
  Clock, 
  Bot,
  Settings,
  ArrowLeft,
  Search,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";
import { useWhatsAppChats } from "@/hooks/useWhatsAppChats";
import { useToast } from "@/hooks/use-toast";

interface WhatsAppModuleProps {
  onBack: () => void;
}

const WhatsAppModule = ({ onBack }: WhatsAppModuleProps) => {
  const [activeTab, setActiveTab] = useState("chats");
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { chats, loading, refetch } = useWhatsAppChats();
  const { toast } = useToast();

  const filteredChats = chats.filter(chat =>
    chat.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.customer_phone.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'destructive';
      case 'responded': return 'default';
      case 'closed': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'responded': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedChat) return;
    
    try {
      // Here you would integrate with WhatsApp Business API
      toast({
        title: "Mensaje enviado",
        description: "El mensaje ha sido enviado exitosamente",
      });
      setMessageText("");
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al enviar el mensaje",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <header className="bg-card border-b shadow-soft px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <MessageCircle className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">WhatsApp Business</h1>
              <p className="text-sm text-muted-foreground">Sistema de ventas automatizado</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Bot className="h-4 w-4 mr-1" />
              AI Activo
            </Badge>
            <Badge variant="outline">
              {chats.length} Chats
            </Badge>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Chat List */}
        <div className="w-80 border-r bg-card">
          <div className="p-4 border-b">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="overflow-y-auto h-[calc(100vh-200px)]">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Cargando chats...</p>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No hay chats disponibles</p>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                    selectedChat?.id === chat.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">
                        {chat.customer_name || chat.customer_phone}
                      </span>
                    </div>
                    <Badge variant={getStatusColor(chat.status)} className="text-xs">
                      {getStatusIcon(chat.status)}
                      {chat.status === 'pending' ? 'Pendiente' : 
                       chat.status === 'responded' ? 'Respondido' : 'Cerrado'}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground truncate mb-1">
                    {chat.last_message || "Sin mensajes"}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(chat.message_time).toLocaleTimeString('es-MX', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    {chat.unread_count > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {chat.unread_count}
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {selectedChat.customer_name || selectedChat.customer_phone}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedChat.customer_phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-green-50 to-white">
                <div className="space-y-4">
                  {/* Sample messages */}
                  <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-lg shadow-sm border max-w-xs">
                      <p className="text-sm">{selectedChat.last_message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(selectedChat.message_time).toLocaleTimeString('es-MX')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="bg-green-500 text-white p-3 rounded-lg shadow-sm max-w-xs">
                      <p className="text-sm">Hola, ¿en qué puedo ayudarte hoy?</p>
                      <p className="text-xs text-green-100 mt-1">
                        {new Date().toLocaleTimeString('es-MX')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-card">
                <div className="flex items-center gap-2">
                  <Textarea
                    placeholder="Escribe un mensaje..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1 min-h-[40px] max-h-[120px]"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Selecciona un chat</h3>
                <p className="text-muted-foreground">
                  Elige una conversación para comenzar a chatear
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - AI Settings */}
        <div className="w-80 border-l bg-card">
          <Tabs defaultValue="ai" className="h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ai">AI Settings</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="ai" className="p-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Respuestas Automáticas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Activar AI</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Respuesta rápida</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cotizaciones auto</span>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Estilo Alex Dey</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-xs text-muted-foreground">
                    ✓ Tono profesional pero amigable
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ✓ Conocimiento de construcción
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ✓ Respuestas contextuales
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="p-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Respuestas Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                    Saludos de bienvenida
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                    Solicitar cotización
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                    Información de entrega
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                    Horarios de atención
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppModule;
