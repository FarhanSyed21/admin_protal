/*eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { json, useNavigate } from 'react-router-dom';
import './Login.css';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authToken, setAuthToken] = useState('');
  const navigate = useNavigate();

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
    setUsername('');
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleLogin = async (e) => {
    console.log(username);
    console.log(password);
    e.preventDefault();

    const loginData = { username};
    localStorage.setItem("user_name" , loginData.username);

    try {
      const response = await fetch(`http://k8s-developm-ingressa-1c98111f81-862727769.ap-south-1.elb.amazonaws.com/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Basic ZGVtby1jbGllbnQ6ZGVtby1zZWNyZXQ=", 
        },
        body: JSON.stringify({
          username: username,
          grant_type: "grant_password", 
          password: password,
        }),
      });

      const data = await response.json();

      console.log(data.access_token);
      setAuthToken(data.access_token);
      localStorage.setItem('authToken', data.access_token);

      if (response.ok) {
    
        navigate('/home', {
          state: { authToken: data.access_token, defaultOption: 'organization' },
        });
      } else {
        alert('Login failed. Please check your username and password.');
      }
    } catch (error) {
      console.log('Login failed. Try again.', error);
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const userData = { name, username, email, password };
    localStorage.setItem('user', JSON.stringify(userData));


    navigate('/home', { state: { defaultOption: 'userList' } });
  };

  return (
    <div className="login-page">
      <div className="login-left">
      <img src={require('../../../assets/logo/Kamai.png')} alt="Kamai Logo" className="login-logo" style={{width: '90px'}}/>

        <div className="login-header">
          <h1>{isLogin ? 'Welcome to kamai' : 'Join kamai'}</h1>
          <p>{isLogin ? 'Sign into your account' : 'Create a new account'}</p>
        </div>
        <form className="login-form">
          {!isLogin && (
            <input
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
          />

          {!isLogin && (
            <>
              <input
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
              />
            </>
          )}

          <button
            type="submit"
            className="login-button"
            onClick={isLogin ? handleLogin : handleSignup}
          >
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
          <span>
            {isLogin ? (
              <>
                Not a member?{' '}
                <a href="#" onClick={handleToggleForm}>
                  Sign Up Now
                </a>
              </>
            ) : (
              <>
                Already a member?{' '}
                <a href="#" onClick={handleToggleForm}>
                  Log In
                </a>
              </>
            )}
          </span>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

