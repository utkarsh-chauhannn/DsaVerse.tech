import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Visualizer from './pages/Visualizer';
import DataStructuresMenu from './pages/DataStructuresMenu';
import StackVisualizer from './pages/StackVisualizer';
import QueueVisualizer from './pages/QueueVisualizer';
import LinkedListVisualizer from './pages/LinkedListVisualizer';
import TreeVisualizer from './pages/TreeVisualizer';
import GraphVisualizer from './pages/GraphVisualizer';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';

import './App.css';

function RequireAuth({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Home />} />
          <Route
            path="/sorting"
            element={
              <RequireAuth>
                <Visualizer />
              </RequireAuth>
            }
          />
          <Route
            path="/data-structures"
            element={
              <RequireAuth>
                <DataStructuresMenu />
              </RequireAuth>
            }
          />
          <Route
            path="/stack"
            element={
              <RequireAuth>
                <StackVisualizer />
              </RequireAuth>
            }
          />
          <Route
            path="/queue"
            element={
              <RequireAuth>
                <QueueVisualizer />
              </RequireAuth>
            }
          />
          <Route
            path="/linked-list"
            element={
              <RequireAuth>
                <LinkedListVisualizer />
              </RequireAuth>
            }
          />
          <Route
            path="/tree"
            element={
              <RequireAuth>
                <TreeVisualizer />
              </RequireAuth>
            }
          />
          <Route
            path="/graph"
            element={
              <RequireAuth>
                <GraphVisualizer />
              </RequireAuth>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
