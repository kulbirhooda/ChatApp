import React, { useState } from "react";
import useAuth from "../context/authContext";
import auth from "../lib/auth";
import { useNavigate } from "react-router";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { signin } = useAuth();

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { user, token } = await signin({ email, password });
      auth.token = token;
      auth.user = user;
      navigate("/dashboard");
    } catch {
      alert("Invalid email or password");
    }
  };

  return (
    <>
      <style>{`
        /* Reset and Base Styles */
        body {
          margin: 0;
          font-family: "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif;
          background-color: #d1d7db; /* WhatsApp Web Gray Background */
          -webkit-font-smoothing: antialiased;
        }

        /* The Green Top Strip */
        .wa-green-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 225px;
          background-color: #00a884; /* Signature Green */
          z-index: -1;
        }

        /* Main Layout */
        .app-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
        }

        /* The Floating Card */
        .auth-card {
          background: white;
          width: 100%;
          max-width: 450px; /* Slightly wider */
          border-radius: 3px;
          box-shadow: 0 17px 50px 0 rgba(11, 20, 26, .19), 0 12px 15px 0 rgba(11, 20, 26, .24);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: fadein 0.3s ease-out;
        }

        /* Header Section inside Card */
        .card-header {
          padding: 40px 40px 20px 40px;
        }
        
        .auth-title {
          font-size: 28px;
          font-weight: 300;
          color: #41525d;
          margin-bottom: 10px;
        }

        .auth-subtitle {
          font-size: 16px;
          color: #8696a0;
          line-height: 1.5;
        }

        /* Form Area */
        .form-content {
          padding: 0 40px 40px 40px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Inputs */
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .input-group label {
          font-size: 14px;
          color: #00a884;
          font-weight: 500;
        }

        .auth-card input {
          width: 100%;
          padding: 10px 0;
          border: none;
          border-bottom: 2px solid #e9edef;
          outline: none;
          font-size: 17px;
          color: #3b4a54;
          background: transparent;
          transition: border-color 0.2s;
          box-sizing: border-box; /* Ensures padding doesn't break width */
        }

        .auth-card input:focus {
          border-bottom: 2px solid #00a884;
        }

        .auth-card input::placeholder {
          color: #8696a0;
        }

        /* Button */
        .auth-card button {
          margin-top: 10px;
          padding: 12px;
          background: #00a884;
          color: white;
          border: none;
          border-radius: 24px; /* Rounded pill shape */
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.5px;
          transition: background 0.2s;
        }

        .auth-card button:hover {
          background: #008f6f;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        /* Switch (Sign up link) */
        .switch {
          margin-top: 10px;
          text-align: center;
          font-size: 14px;
          color: #8696a0;
        }

        .switch span {
          color: #00a884;
          cursor: pointer;
          font-weight: 600;
          margin-left: 5px;
        }

        .switch span:hover {
          text-decoration: underline;
        }
        
        /* Logo placeholder (Optional) */
        .logo-area {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 30px;
          color: white;
          position: absolute;
          top: 30px;
          left: 40px;
          font-weight: 600;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        @keyframes fadein {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* The background split */}
      <div className="wa-green-header"></div>
      
      {/* Optional: WhatsApp-style Logo text in top left */}
      <div className="logo-area">
        <span>ChatApp Web</span>
      </div>

      <div className="app-container">
        <form className="auth-card" onSubmit={formSubmitHandler}>
          
          <div className="card-header">
            <div className="auth-title">Log in to ChatApp</div>
            <div className="auth-subtitle">
              Connect with your friends and family quickly and easily.
            </div>
          </div>

          <div className="form-content">
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit">Sign In</button>

            <div className="switch">
              Not a user? 
              <span onClick={() => navigate("/signup")}>Get started</span>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Signin;