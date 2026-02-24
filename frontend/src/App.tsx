import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EventBooking from './pages/EventBooking';
import MyTickets from './pages/MyTickets';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Home />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/book/:id" element={<EventBooking />} />
            <Route path="/my-tickets" element={<MyTickets />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
