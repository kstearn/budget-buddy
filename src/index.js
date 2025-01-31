import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Dashboard from './routes/Dashboard';
import Budget from './routes/Budget';
import Spending from './routes/Spending';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="auth" element={<Auth />} />
          <Route path="budget" element={<Budget />} />
          <Route path="spending" element={<Spending />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
