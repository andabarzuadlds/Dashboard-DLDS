import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Pedidos from './views/Pedidos'
import Clientes from './views/Clientes'
import Index from './views/Index'
import './assets/css/index.css'
import Login from './views/Login'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" Component={Index} />
        <Route path="/clientes" Component={Clientes} />
        <Route path="/pedidos" Component={Pedidos} />
        <Route path="/login" Component={Login} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)
