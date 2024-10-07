import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [mobileNumber, setMobileNumber] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleMobileChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue === '' || /^[0-9\b]+$/.test(inputValue)) {
      setMobileNumber(inputValue);
    }
  };

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
    setMobileNumber('');
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://k8s-developm-ingressa-1c98111f81-862727769.ap-south-1.elb.amazonaws.com/employer/otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ZGVtby1jbGllbnQ6ZGVtby1zZWNyZXQ=',
        },
        body: JSON.stringify({
          loginType: 'Mobile',
          username: `+91${mobileNumber}`,
        }),
      });
      if (response.ok) {
        console.log('OTP sent successfully');
        localStorage.setItem("Mobile number", mobileNumber)
        navigate('/otp', { state: { phoneNumber: mobileNumber } });
      }
    } catch (error) {
      console.log('error');
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const userData = { name, mobileNumber, email, password };
    localStorage.setItem('user', JSON.stringify(userData));

    navigate('/home', { state: { defaultOption: 'userList' } });
  };

  return (
    <div className="login-page" style={{}}>
      <div className="login-left">
        <img src={require('../../../assets/logo/Kamai.png')} alt="Kamai Logo" className="login-logo" style={{width: '90px'}}/>
        <div className="login-header">
          <h1>{isLogin ? 'Welcome to Kamai' : 'Join Kamai'}</h1>
          <p>{isLogin ? 'Sign into your account' : 'Create a new account'}</p>
        </div>
        <form className="login-form" >
          {!isLogin && (
            <input
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            placeholder="Enter Mobile Number"
            value={mobileNumber}
            onChange={handleMobileChange}
            required
            maxLength={10}
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
              <input
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
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
                Not a member? <a href="#" onClick={handleToggleForm}>Sign Up Now</a>
              </>
            ) : (
              <>
                Already a member? <a href="#" onClick={handleToggleForm}>Log In</a>
              </>
            )}
          </span>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;


