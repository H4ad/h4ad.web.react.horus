import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { environment } from './environments/environment';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import usePWAStore from './store/usePWA';
import { configureErrorHandler } from './apocalypse-handler';

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root'),
);

if (environment.enablePWA) {
  serviceWorkerRegistration.register({
    onSuccess: worker => usePWAStore.getState().onWorkerSuccess(worker),
    onUpdate: worker => usePWAStore.getState().onWorkerUpdate(worker),
  });
}

configureErrorHandler();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
