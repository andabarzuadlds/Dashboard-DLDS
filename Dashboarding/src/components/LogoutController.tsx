import axios from 'axios';
import { useState } from 'react';
import { redirect } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const LogoutController: React.FC = () => {
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogout = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setErrorMessage('No hay información del usuario para cerrar sesión');
      setTimeout(() => {
        setMessage('');
      }, 2000);
      return;
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/users/logout',
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setMessage('Has cerrado sesión correctamente');
        setTimeout(() => {
          setMessage('');
        }, 2000);
      } else {
        throw new Error(response.data.msg);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
        setTimeout(() => {
          setMessage('');
        }, 2000);
      } else {
        setErrorMessage('Ocurrió un error al intentar cerrar la sesión');
        setTimeout(() => {
          setMessage('');
        }, 2000);
      }
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Cerrar sesión</button>
      {message && <div className="p-3 bg-green-300 text-green-800 rounded">{message}</div>}
      {errorMessage && <div className="p-3 bg-red-300 text-red-800 rounded">{errorMessage}</div>}
    </div>
  );
};

export default LogoutController;
