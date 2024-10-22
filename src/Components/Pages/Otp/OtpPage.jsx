/*eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './OtpPage.css';

const OtpPage = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [seconds, setSeconds] = useState(30);
  const [authToken, setAuthToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const phoneNumber = location.state?.phoneNumber

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds > 0) {
          return prevSeconds - 1;
        } else {
          clearInterval(timer);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (value.length <= 1 && !isNaN(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < otp.length - 1 && value.length === 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleSubmitOtp = async() => {
    console.log(phoneNumber)
    try{
      const response = await fetch(`http://k8s-developm-ingressa-1c98111f81-862727769.ap-south-1.elb.amazonaws.com/employer/login`,{
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
          Authorization : "Basic ZGVtby1jbGllbnQ6ZGVtby1zZWNyZXQ=",
        },
        body: JSON.stringify({
          "username": `+91${phoneNumber}`,
          "grant_type": "grant_otp",
          "otp":1191,
          "username_attr_type": "mobile_number" 
        }),
      })
      const data = await response.json();
      console.log(data.access_token)
      setAuthToken(data.access_token)
      if(response.ok){
        if (otp.join('').length === 4) {
          navigate('/home', { state: { authToken: data.access_token, defaultOption: 'organization' } });
        } else {
          alert('Please enter a valid 4-digit OTP');
        }
      }
    }catch(error){
      console.log("OTP verification Failed. Try again.")
    }
  };

  const handlekeyPress = (e) => {
    if(e.key === "Enter"){
      handleSubmitOtp();
    }
  }

  return (
    <div className="container">
      <div className="card">
        <img src={require('../../../assets/logo/Kamai.png')} alt="OTP Icon" className="icon" style={{width: '100px'}}/>
        <h2 className="title">OTP Verification</h2>
        <p className="message">
          One Time Password (OTP) has been sent via SMS to +91-{phoneNumber}.
          <br />
          Enter the OTP below to verify it.
        </p>
        <div className="otp-container">
          {otp.map((value, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              value={value}
              onChange={(e) => handleOtpChange(e, index)}
              onKeyDown={handlekeyPress}
              maxLength={1}
              className="otp-input"
              autoFocus={index === 0} 
            />
          ))}
        </div>
        <button className="button" onClick={handleSubmitOtp}>
          Verify OTP
        </button>
        <p className="resend-text">
          Resend OTP in <span className="timer">{`00:${seconds < 10 ? `0${seconds}` : seconds}`}</span>
        </p>
      </div>
    </div>
  );
};

export default OtpPage;
