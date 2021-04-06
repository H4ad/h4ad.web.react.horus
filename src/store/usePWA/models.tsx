export type UsePWAStore = {
  isAvailable: boolean;
  hasUpdateAvailable: boolean;
  serviceWorker?: ServiceWorkerRegistration;

  onWorkerSuccess?: (worker: ServiceWorkerRegistration) => void;
  onWorkerUpdate?: (worker: ServiceWorkerRegistration) => void;
  updatePWA?: () => void;
  ignoreUpdateAvailable?: () => void;
}
