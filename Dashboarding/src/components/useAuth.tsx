import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      navigate('/'); // Redirige a la ruta de inicio si ya está autenticado
    }
  }, [token, navigate]);
};
// auth.ts
export const isAuthenticated = () => !!localStorage.getItem('token');


export default useAuth;
