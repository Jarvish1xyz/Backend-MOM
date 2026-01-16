// import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

import Layout from './component/Layout';
import Home from './component/Home';
import AuthPage from './component/pages/Auth/AuthPage';
import CreateMOM from './component/pages/CreateMOM/CreateMOM';
import Profile from './component/Profile';

function App() {
  const [isLogin, setIsLogin] = useState(!!localStorage.getItem('token'));

  const handleAuthChange = () => {
    setIsLogin(!!localStorage.getItem('token'));
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* 🔐 AUTH ROUTE */}
        {!isLogin ? (
          <Route path="/auth" element={<AuthPage onClickCheck={handleAuthChange} />} />
        ) : (
          /* 🏠 PROTECTED ROUTES */
          <Route path="/" element={<Layout onLogout={handleAuthChange} />}>
            <Route index element={<Home />} />
            <Route path="create" element={<CreateMOM />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        )}

        <Route path="*" element={<Navigate to={isLogin ? "/" : "/auth"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
