import { useEffect, useCallback } from 'react';

interface UseGlobalHotkeysProps {
  onModuleChange: (module: string) => void;
  currentModule?: string;
}

export const useGlobalHotkeys = ({ onModuleChange, currentModule }: UseGlobalHotkeysProps) => {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Only trigger if not in an input field
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement || 
        event.target instanceof HTMLSelectElement) {
      return;
    }

    switch (event.key) {
      case 'F1':
        event.preventDefault();
        if (currentModule === 'pos') {
          // Focus search input if in POS
          document.getElementById('search-input')?.focus();
        } else {
          onModuleChange('pos');
        }
        break;
      case 'F2':
        event.preventDefault();
        onModuleChange('inventory');
        break;
      case 'F3':
        event.preventDefault();
        onModuleChange('admin');
        break;
      case 'F4':
        event.preventDefault();
        onModuleChange('crm');
        break;
      case 'F5':
        event.preventDefault();
        onModuleChange('delivery');
        break;
      case 'F6':
        event.preventDefault();
        onModuleChange('credit');
        break;
      case 'F7':
        event.preventDefault();
        onModuleChange('whatsapp');
        break;
      case 'F8':
        event.preventDefault();
        onModuleChange('reports');
        break;
      case 'F9':
        event.preventDefault();
        onModuleChange('supervision');
        break;
      default:
        break;
    }
  }, [onModuleChange, currentModule]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);
};