import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import './styles.css';
import Api from "../config/api";

export default function Login() { 
  
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const naviagate = useNavigate();
    async function login(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log({username, password});
        const response = await Api.post(`api/oauth2/v1/token?grant_type=password&username=${username}&password=${password}`)
        // naviagate(`/produto?token=${response.data.access_token}`)
        naviagate(`/produto`, {state: {token: response.data.access_token}})
    }

    function ValidarUsuario (){
      if (username == "001169" && password == "123456") {
        alert("Usuario autenticado, entrando ...")
      }
      else{
        alert("Usuario Invalido, não autenticado no sistema")
      }
    }
    
   
    return (
    <>

<div className="container">
      <div className="container-login">
        <div className="wrap-login">
          <form  className="login-form" onSubmit={event => login(event)}>
            <span className="login-form-title">
              Bem vindo a Tecadi Treinamento
            </span>
            <div className="wrap-input">
              <input className="input" name="username" id="username" type="text" onChange={event => setUsername(event.target.value)} />
              <span className="focus-input" data-placeholder="Username"></span>
            </div>
            <div className="wrap-input">
              <input className="input" name="password" id="password"  type="password" onChange={event => setPassword(event.target.value)} />
              <span className="focus-input" data-placeholder="password"></span>
            </div>
            <div className="container-login-form-btn">
              <button className="login-form-btn" onClick={ValidarUsuario} type="submit">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
    )
}