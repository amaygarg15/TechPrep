import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import QuestionDetail from './pages/QuestionDetail';
import Upgrade from './pages/Upgrade';
import { Code2, LogOut } from 'lucide-react';

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function Layout({ children }) {
  const { currentUser, logout } = useAuth();
  
  return (
    <>
      {currentUser && (
        <header className="app-header">
          <a href="/" className="nav-brand">
            <Code2 size={28} color="#60a5fa" />
            <span>TechPrep</span>
          </a>
          <button onClick={logout} className="btn btn-outline">
            <LogOut size={16} /> Logout
          </button>
        </header>
      )}
      <main>{children}</main>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/question/:id" element={<ProtectedRoute><QuestionDetail /></ProtectedRoute>} />
            <Route path="/upgrade" element={<ProtectedRoute><Upgrade /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
