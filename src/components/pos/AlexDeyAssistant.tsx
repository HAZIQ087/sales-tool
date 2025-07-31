
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, MessageSquare, TrendingUp, User, Lightbulb, X, Minimize2, Maximize2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface AlexDeyAssistantProps {
  cartItems: any[];
  selectedCustomer?: any;
  onSuggestion: (suggestion: any) => void;
}

const AlexDeyAssistant: React.FC<AlexDeyAssistantProps> = ({
  cartItems,
  selectedCustomer,
  onSuggestion
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [currentEmotion, setCurrentEmotion] = useState<'neutral' | 'happy' | 'concerned'>('neutral');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [customerContext, setCustomerContext] = useState<string>('');

  // Simulate AI emotional detection
  useEffect(() => {
    const emotions = ['neutral', 'happy', 'concerned'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)] as typeof currentEmotion;
    setCurrentEmotion(randomEmotion);
  }, [cartItems]);

  // Generate smart suggestions based on cart items
  useEffect(() => {
    if (cartItems.length > 0) {
      const mockSuggestions = [
        {
          id: 1,
          type: 'cross-sell',
          title: 'Producto Complementario',
          description: 'Los clientes que compraron este producto también necesitaron...',
          product: 'Tornillos de acero inoxidable',
          reason: 'Complementa perfectamente con el producto seleccionado'
        },
        {
          id: 2,
          type: 'upsell',
          title: 'Producto Superior',
          description: 'Considera esta opción de mayor calidad...',
          product: 'Taladro profesional premium',
          reason: 'Mayor durabilidad y garantía extendida'
        },
        {
          id: 3,
          type: 'bundle',
          title: 'Paquete Especial',
          description: 'Ahorra comprando en conjunto...',
          product: 'Kit completo de herramientas',
          reason: 'Descuento del 15% al comprar todo junto'
        }
      ];
      setSuggestions(mockSuggestions);
    }
  }, [cartItems]);

  // Generate customer context
  useEffect(() => {
    if (selectedCustomer) {
      const contexts = [
        'Cliente frecuente - Compra regularmente herramientas eléctricas',
        'Nueva compra después de 3 meses - Puede estar iniciando nuevo proyecto',
        'Cliente VIP - Historial de compras altas, ofrecer productos premium',
        'Cliente mayorista - Considerar descuentos por volumen'
      ];
      setCustomerContext(contexts[Math.floor(Math.random() * contexts.length)]);
    }
  }, [selectedCustomer]);

  const getEmotionColor = () => {
    switch (currentEmotion) {
      case 'happy': return 'text-green-500';
      case 'concerned': return 'text-yellow-500';
      default: return 'text-blue-500';
    }
  };

  const getEmotionBadge = () => {
    switch (currentEmotion) {
      case 'happy': return 'Entusiasta';
      case 'concerned': return 'Dudoso';
      default: return 'Neutral';
    }
  };

  const persuasivePhrases = [
    "Este producto es perfecto para tu proyecto",
    "Muchos clientes han quedado satisfechos con esta opción",
    "Considera que esto te ahorrará tiempo y dinero",
    "Es una inversión que vale la pena",
    "Disponible por tiempo limitado"
  ];

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full h-12 w-12 p-0"
        variant="default"
      >
        <Bot className="h-5 w-5" />
      </Button>
    );
  }

  if (isMinimized) {
    return (
      <Card className="fixed bottom-4 right-4 z-50 w-80">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className={`h-5 w-5 ${getEmotionColor()} animate-pulse`} />
              <span className="text-sm">Alex Dey</span>
              <Badge variant="secondary" className="text-xs">
                {getEmotionBadge()}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(false)}
                className="h-6 w-6 p-0"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 max-h-96 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className={`h-5 w-5 ${getEmotionColor()} animate-pulse`} />
            <span>Alex Dey - Asistente de Ventas</span>
            <Badge variant="secondary">
              {getEmotionBadge()}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="h-6 w-6 p-0"
            >
              <Minimize2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-auto max-h-80">
        {/* Customer Context */}
        {selectedCustomer && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">Contexto del Cliente</span>
            </div>
            <p className="text-sm text-muted-foreground">{customerContext}</p>
          </div>
        )}

        {/* Smart Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Sugerencias Inteligentes</span>
            </div>
            {suggestions.slice(0, 2).map((suggestion) => (
              <div key={suggestion.id} className="p-2 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{suggestion.title}</h4>
                    <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                    <p className="text-xs font-medium mt-1">{suggestion.product}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSuggestion(suggestion)}
                    className="ml-2"
                  >
                    Sugerir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Persuasive Phrases */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Frases Persuasivas</span>
          </div>
          <div className="space-y-1">
            {persuasivePhrases.slice(0, 3).map((phrase, index) => (
              <p key={index} className="text-xs p-2 bg-blue-50 rounded text-blue-700">
                💬 {phrase}
              </p>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="flex-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                Análisis
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Análisis de Venta</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium">Probabilidad de Compra</h4>
                    <p className="text-2xl font-bold text-green-600">78%</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium">Valor Promedio</h4>
                    <p className="text-2xl font-bold">$2,450</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Recomendaciones:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Ofrecer garantía extendida</li>
                    <li>• Sugerir productos complementarios</li>
                    <li>• Aplicar descuento por volumen si es apropiado</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlexDeyAssistant;
