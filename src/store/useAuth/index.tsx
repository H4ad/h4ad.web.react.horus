import { createAuthStore } from './store.prod';

const useAuthStore = createAuthStore();

export default useAuthStore;
export * from './models';
