import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, createContext, useContext } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

/* ── Simple auth context (no backend needed for demo) ── */
interface AuthCtx { loggedIn: boolean; login: () => void; logout: () => void; }
const Auth = createContext<AuthCtx>({ loggedIn: false, login: () => {}, logout: () => {} });
export const useAuth = () => useContext(Auth);

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { loggedIn } = useAuth();
  return loggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};

export default function App() {
  const [loggedIn, setLoggedIn] = useState(
    () => sessionStorage.getItem('srv_auth') === 'true'
  );

  const login  = () => { sessionStorage.setItem('srv_auth', 'true');  setLoggedIn(true);  };
  const logout = () => { sessionStorage.removeItem('srv_auth');        setLoggedIn(false); };

  return (
    <Auth.Provider value={{ loggedIn, login, logout }}>
      <BrowserRouter basename="/school-erp">
        <Routes>
          <Route path="/login" element={loggedIn ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/*"     element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </Auth.Provider>
  );
}
