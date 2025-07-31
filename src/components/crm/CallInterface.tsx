import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, PhoneCall, PhoneOff, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CallInterfaceProps {
  customerPhone?: string;
  customerName?: string;
  onCallStatusChange?: (status: 'idle' | 'calling' | 'connected' | 'ended') => void;
}

const CallInterface = ({ customerPhone = "", customerName = "", onCallStatusChange }: CallInterfaceProps) => {
  const [phoneNumber, setPhoneNumber] = useState(customerPhone);
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un número de teléfono",
        variant: "destructive",
      });
      return;
    }

    setCallStatus('calling');
    onCallStatusChange?.('calling');
    
    toast({
      title: "Llamando...",
      description: `Llamando a ${customerName || phoneNumber}`,
    });

    // Simulate call connection after 3 seconds
    setTimeout(() => {
      setCallStatus('connected');
      onCallStatusChange?.('connected');
      setCallDuration(0);
      
      // Start call timer
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      toast({
        title: "Llamada conectada",
        description: `Conectado con ${customerName || phoneNumber}`,
      });
    }, 3000);
  };

  const endCall = () => {
    setCallStatus('ended');
    onCallStatusChange?.('ended');
    
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    
    toast({
      title: "Llamada finalizada",
      description: `Duración: ${formatDuration(callDuration)}`,
    });
    
    // Reset after 2 seconds
    setTimeout(() => {
      setCallStatus('idle');
      setCallDuration(0);
      setIsMuted(false);
      setIsSpeakerOn(false);
      onCallStatusChange?.('idle');
    }, 2000);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Micrófono activado" : "Micrófono silenciado",
      description: isMuted ? "El cliente puede escucharte" : "El cliente no puede escucharte",
    });
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    toast({
      title: isSpeakerOn ? "Altavoz desactivado" : "Altavoz activado",
      description: isSpeakerOn ? "Audio por auriculares" : "Audio por altavoz",
    });
  };

  const dialPadNumbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ];

  const addDigit = (digit: string) => {
    setPhoneNumber(prev => prev + digit);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          {callStatus === 'idle' ? 'Realizar Llamada' : 
           callStatus === 'calling' ? 'Llamando...' :
           callStatus === 'connected' ? 'En Llamada' : 'Llamada Finalizada'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Phone Input */}
        <div className="space-y-2">
          <Label htmlFor="phone">Número de teléfono</Label>
          <Input
            id="phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+52 555 123 4567"
            disabled={callStatus !== 'idle'}
          />
          {customerName && (
            <p className="text-sm text-muted-foreground">
              Cliente: {customerName}
            </p>
          )}
        </div>

        {/* Call Status */}
        {callStatus === 'connected' && (
          <div className="text-center">
            <div className="text-2xl font-mono text-primary">
              {formatDuration(callDuration)}
            </div>
            <p className="text-sm text-muted-foreground">Duración de la llamada</p>
          </div>
        )}

        {/* Dial Pad */}
        {callStatus === 'idle' && (
          <div className="grid grid-cols-3 gap-2">
            {dialPadNumbers.flat().map((number) => (
              <Button
                key={number}
                variant="outline"
                className="h-12 text-lg font-semibold"
                onClick={() => addDigit(number)}
              >
                {number}
              </Button>
            ))}
          </div>
        )}

        {/* Call Controls */}
        <div className="flex justify-center gap-3">
          {callStatus === 'idle' && (
            <Button 
              onClick={startCall}
              className="bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <PhoneCall className="h-5 w-5 mr-2" />
              Llamar
            </Button>
          )}
          
          {(callStatus === 'calling' || callStatus === 'connected') && (
            <>
              {callStatus === 'connected' && (
                <>
                  <Button
                    variant={isMuted ? "destructive" : "outline"}
                    onClick={toggleMute}
                    size="sm"
                  >
                    {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    variant={isSpeakerOn ? "default" : "outline"}
                    onClick={toggleSpeaker}
                    size="sm"
                  >
                    {isSpeakerOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                </>
              )}
              
              <Button 
                onClick={endCall}
                className="bg-red-600 hover:bg-red-700 text-white"
                size={callStatus === 'calling' ? 'lg' : 'sm'}
              >
                <PhoneOff className="h-4 w-4 mr-2" />
                {callStatus === 'calling' ? 'Cancelar' : 'Colgar'}
              </Button>
            </>
          )}
        </div>

        {/* Call Status Indicator */}
        <div className="flex items-center justify-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${
            callStatus === 'idle' ? 'bg-gray-400' :
            callStatus === 'calling' ? 'bg-yellow-500 animate-pulse' :
            callStatus === 'connected' ? 'bg-green-500' :
            'bg-red-500'
          }`}></div>
          <span className="text-muted-foreground">
            {callStatus === 'idle' ? 'Listo para llamar' :
             callStatus === 'calling' ? 'Conectando...' :
             callStatus === 'connected' ? 'Llamada activa' :
             'Llamada finalizada'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CallInterface;