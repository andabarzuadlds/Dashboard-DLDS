import React, { useState } from 'react';
import axios from 'axios';
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';

const LoginController: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", password);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/users/login', formData);

      if (response.data && response.data.success) {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }

        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          setMessage('Has iniciado sesión correctamente');
          setTimeout(() => {
            setMessage('');
            navigate('/pedidos');
          }, 1000);
          
        }
      } else {
        throw new Error(response.data?.msg || 'Error de inicio de sesión');
        setTimeout(() => {
          setMessage('');
        }, 2000);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Ocurrió un error al intentar iniciar sesión');
        setTimeout(() => {
          setMessage('');
        }, 2000);
      }
    }
  };

  return (
    <div className='flex justify-center'>
      <center>
        <Card color="transparent" shadow={false}>
          <Typography variant="h4" color="blue-gray">
            Iniciar sesión
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
            Ingresa tus detalles para iniciar sesión.
          </Typography>
          <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
            <div className="mb-4 flex flex-col gap-6">
              <Input size="lg" label="" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input type="password" size="lg" label="" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button className="mt-6" fullWidth type="submit">
              Iniciar sesión
            </Button>
            <Typography color="gray" className="mt-4 text-center font-normal">
              ¿No tienes una cuenta?{" "}
              <a
                href="#"
                className="font-medium text-blue-500 transition-colors hover:text-blue-700"
              >
                Regístrate
              </a>
            </Typography>
          </form>
          {message && <div className="text-green-500">{message}</div>}
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        </Card>
      </center>
    </div>

  );
};

export default LoginController;
