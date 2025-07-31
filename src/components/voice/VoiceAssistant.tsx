import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceAssistantProps {
  isActive: boolean;
  onToggle: () => void;
  onSpeakingChange?: (speaking: boolean) => void;
}

const VoiceAssistant = ({ isActive, onToggle, onSpeakingChange }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'es-ES';

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
          handleVoiceCommand(finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Voice commands for POS
    if (lowerCommand.includes('buscar')) {
      const searchInput = document.getElementById('search-input') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
        speak("¿Qué producto deseas buscar?");
      }
    } else if (lowerCommand.includes('descuento')) {
      speak("¿Qué porcentaje de descuento deseas aplicar?");
    } else if (lowerCommand.includes('cobrar') || lowerCommand.includes('finalizar')) {
      speak("Procesando venta...");
      // Trigger checkout
      const checkoutBtn = document.querySelector('[data-action="checkout"]') as HTMLButtonElement;
      if (checkoutBtn) {
        checkoutBtn.click();
      }
    } else if (lowerCommand.includes('ayuda')) {
      speak("Puedes decir: buscar producto, aplicar descuento, cobrar venta, o cancelar operación");
    } else {
      speak("No entendí el comando. Di 'ayuda' para ver los comandos disponibles.");
    }
  };

  const speak = (text: string) => {
    if (synthRef.current) {
      setIsSpeaking(true);
      onSpeakingChange?.(true);
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onend = () => {
        setIsSpeaking(false);
        onSpeakingChange?.(false);
      };
      
      synthRef.current.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Error",
        description: "Reconocimiento de voz no soportado en este navegador",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      speak("Escuchando... ¿En qué puedo ayudarte?");
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      onSpeakingChange?.(false);
    }
  };

  if (!isActive) {
    return (
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Mic className="h-5 w-5" />
            Asistente Alex Dey
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-3">
            "¡Hola! Presiona el botón para activar el asistente de voz."
          </p>
          <Button onClick={onToggle} variant="secondary" size="sm">
            Activar Asistente
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Mic className={`h-5 w-5 ${isListening ? 'animate-pulse text-red-500' : ''}`} />
          Asistente Alex Dey {isListening && "(Escuchando...)"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-3">
          {isSpeaking ? "Hablando..." : 
           isListening ? "Te escucho... di tu comando" :
           "Listo para ayudarte. Presiona el micrófono para hablar."}
        </p>
        
        {transcript && (
          <div className="bg-muted p-2 rounded mb-3 text-sm">
            <strong>Escuchado:</strong> {transcript}
          </div>
        )}
        
        <div className="flex gap-2">
          <Button 
            onClick={toggleListening}
            variant={isListening ? "destructive" : "secondary"} 
            size="sm"
            disabled={isSpeaking}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isListening ? "Parar" : "Escuchar"}
          </Button>
          
          {isSpeaking && (
            <Button onClick={stopSpeaking} variant="outline" size="sm">
              <VolumeX className="h-4 w-4" />
              Callar
            </Button>
          )}
          
          <Button onClick={onToggle} variant="ghost" size="sm">
            Desactivar
          </Button>
        </div>
        
        <div className="mt-3 text-xs text-muted-foreground">
          <strong>Comandos:</strong> "buscar producto", "aplicar descuento", "cobrar venta", "ayuda"
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceAssistant;