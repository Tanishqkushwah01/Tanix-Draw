import './App.css';
import { Routes, Route } from "react-router-dom";
import CanvasPage from './pages/CanvasPage';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from "./pages/Login"
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import VerifyOtp from './pages/VerifyOtp';
import ForgotPassword from './pages/ForgotPassword';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';


function App() {

  return (
    <Routes>

      <Route path='/' element={<LandingPage />} />
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/verify-otp' element={<VerifyOtp />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/terms' element={<Terms />} />
      <Route path='/privacy' element={<PrivacyPolicy />} />

      <Route
        path='/canvas'
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/canvas/:id"
        element={
          <ProtectedRoute>
            <CanvasPage />
          </ProtectedRoute>
        }
      />

    </Routes>

  )
}

export default App