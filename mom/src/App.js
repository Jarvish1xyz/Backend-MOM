// import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

import Layout from './component/pages/Layout/Layout';
import Home from './component/pages/Content/Home';
import AuthPage from './component/pages/Auth/AuthPage';
import CreateMOM from './component/pages/CreateMOM/CreateMOM';
import Profile from './component/pages/Content/Profile';
import MeetingDetails from './component/pages/Content/MeetingDetails';
import StarredMeetings from './component/pages/Content/StarredMeetings';

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
            <Route path="starred" element={<StarredMeetings/>} />
            <Route path="meeting/:id" element={<MeetingDetails/>} />
          </Route>
        )}

        <Route path="*" element={<Navigate to={isLogin ? "/" : "/auth"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
