import { useEffect } from 'react';
import { connectPresence } from '../services/presenceService';

export function usePresence(uid: string | null): void {
  useEffect(() => {
    if (!uid) {
      return;
    }

    let disconnect: (() => void) | undefined;
    void connectPresence(uid).then((cleanup) => {
      disconnect = cleanup;
    });

    return () => disconnect?.();
  }, [uid]);
}
