import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Home from './pages/home'
import Login from './pages/login'
import Produto from './pages/produto'

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="produto" element={<Produto />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
)



