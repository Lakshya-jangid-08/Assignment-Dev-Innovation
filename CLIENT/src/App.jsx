import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Notes from './pages/Notes';
import Bookmarks from './pages/Bookmarks';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/notes" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/notes" element={
              <ProtectedRoute>
                <Notes />
              </ProtectedRoute>
            } />
            
            <Route path="/bookmarks" element={
              <ProtectedRoute>
                <Bookmarks />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/notes" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;