import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Dashboard from './routes/Dashboard';
import Budget from './routes/Budget';
import Spending from './routes/Spending';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './auth/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route element={<PrivateRoute />}>
              <Route index element={<Dashboard />} />
              <Route path="budget" element={<Budget />} />
              <Route path="spending" element={<Spending />} />
            </Route>
          </Route>
          <Route path="auth" element={<Auth />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
