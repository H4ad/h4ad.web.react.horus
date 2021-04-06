export const environment = {
  defaultUnprotectedRoute: '/',
  defaultProtectedRoute: '/main',
  enablePWA: false,
  zustandStoreVersion: 1,
  api: {
    baseUrl: process.env.REACT_APP_BASE_URL,
    auth: {
      local: '/auth/local',
    },
    user: {
      me: '/users/me',
    },
  },
};
