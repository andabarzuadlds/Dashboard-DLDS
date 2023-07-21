import React, { useState } from 'react';
import axios from 'axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", password);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/users/login', formData);

      if (response.data && response.data.success) {
        // Asegúrate de que la respuesta contiene un token y un objeto de usuario antes de tratar de almacenarlos
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }

        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      } else {
        throw new Error(response.data?.msg || 'Error de inicio de sesión');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Ocurrió un error al intentar iniciar sesión');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Iniciar sesión</button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

export default Login;
