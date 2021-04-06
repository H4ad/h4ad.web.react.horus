import create, { UseStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getStoreName } from '../utils/functions';
import { UsePWAStore } from './models';

export function createUsePWAStore(): UseStore<UsePWAStore> {
  const name = getStoreName('usePWAStore');

  return create(
    devtools((set, get) => ({
        isAvailable: false,
        hasUpdateAvailable: false,
        onWorkerSuccess: serviceWorker => set({ serviceWorker, isAvailable: true }),
        onWorkerUpdate: serviceWorker => set({ hasUpdateAvailable: true, serviceWorker }),
        updatePWA: () => {
          const serviceWorker = get().serviceWorker;

          // We send the SKIP_WAITING message to tell the Service Worker
          // to update its cache and flush the old one
          (serviceWorker?.waiting || serviceWorker?.active)?.postMessage({ type: 'SKIP_WAITING' });

          set({ hasUpdateAvailable: false });

          window.location.reload();
        },
        ignoreUpdateAvailable: () => set({ hasUpdateAvailable: false }),
      }),
      name,
    ),
  );
}
