import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
import "./axiosConfig";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //   <React.StrictMode> SOLO DESARROLLO
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
