// ...
import axios from 'axios';
import { useState } from 'react';

const Logout: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogout = async () => {
    // Obtener el usuario del almacenamiento local
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Verificar si el usuario no está vacío
    if (Object.keys(user).length === 0) {
      setErrorMessage('No hay información del usuario para cerrar sesión');
      return;
    }

    try {
      // Enviar la información del usuario al backend
      const response = await axios.post('http://127.0.0.1:8000/api/users/logout', { user });

      // Verificar si la operación fue exitosa
      if (response.data.success) {
        // Eliminar el token y la información del usuario del almacenamiento local
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } else {
        throw new Error(response.data.msg);
      }
    } catch (err: unknown) {
      // Chequeo de tipo seguro
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Ocurrió un error al intentar cerrar la sesión');
      }
    }
  };

  return (
    <div>
        <button onClick={handleLogout}>Cerrar sesión</button>
        {errorMessage && <div>{errorMessage}</div>}
    </div>
    
  )
};

export default Logout;
