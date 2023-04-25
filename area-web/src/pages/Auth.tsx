import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../api/api";
import "../styles/Auth.css";

const Auth = () => {
  const [isSigned, setSigned] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSigned = () => {
    setSigned(!isSigned);
  };

  const registerHandler = async (e: any) => {
    e.preventDefault();
    if ((await api.register(username, email, password)).state) {
      window.location.reload();
    } else {
      toast.error('Email already in use or password too weak');
    }
  }

  const loginHandler = async (e: any) => {
    e.preventDefault();
    if ((await api.login(email, password)).state) {
      window.location.reload();
    } else {
      toast.error('Invalid email or password');
    }
  }

  const redirect = (app: string) => {
    window.location.replace(process.env.REACT_APP_API_HOST + ':' + process.env.REACT_APP_API_PORT + "/auth/" + app);
  }

  return (
    <div className="Auth">
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light"/>
      <div className="card">
        <div className="card-top">
          <h1 className="title">AREA</h1>
        </div>
        {isSigned ? (
          <form onSubmit={registerHandler}>
            <div className="card-mid">
              <input type="text" name="username" placeholder="Username" required={true} value={username} onChange={e => setUsername(e.target.value)} />
              <input type="email" name="email" placeholder="Email" required={true} value={email} onChange={e => setEmail(e.target.value)} />
              <input type="password" name="password" placeholder="Password" required={true} value={password} onChange={e => setPassword(e.target.value)} />
              <button className="action">Register</button>
              <span>
                Already have an account ?{" "}
                <button type="reset" onClick={handleSigned}>Sign in</button>
              </span>
            </div>
          </form>
        ) : (
          <form onSubmit={loginHandler}>
            <div className="card-mid">
              <input type="email" name="email" placeholder="Email" required={true} value={email} onChange={e => setEmail(e.target.value)} />
              <input type="password" name="password" placeholder="Password" required={true} value={password} onChange={e => setPassword(e.target.value)} />
              <button className="action">Login</button>
              <span>
                Don't have an account ?{" "}
                <button type="reset" onClick={handleSigned}>Sign up</button>
              </span>
            </div>
          </form>
        )}
        <div className="card-bot">
          <div className="application">
            <button onClick={() => { redirect("github") }}>
              <img src="/logo/logo_github.svg" alt="github" />
            </button>
            <button onClick={() => { redirect("google") }}>
              <img src="/logo/logo_google.svg" alt="google" />
            </button>
            <button onClick={() => { redirect("microsoft") }}>
              <img src="/logo/logo_microsoft.svg" alt="microsoft" />
            </button>
            <button onClick={() => { redirect("twitter") }}>
              <img src="/logo/logo_twitter.svg" alt="twitter" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
