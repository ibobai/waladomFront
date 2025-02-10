import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes';
import './i18n';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
          <div className="flex-1 w-full">
            <AppRoutes />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              className: 'toast-message',
              success: {
                style: {
                  background: '#4CAF50',
                  color: '#fff',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                  color: '#fff',
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;