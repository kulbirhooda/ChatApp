import React, { useState } from "react";
import useAuth from "../context/authContext";
import { useNavigate } from "react-router";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [copySuccess, setCopySuccess] = useState("Copy");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(user.id || user._id);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess("Copy"), 2000);
  };

  if (!user) return null;

  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif;
          background-color: #d1d7db;
        }

        .wa-green-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 225px;
          background-color: #00a884;
          z-index: -1;
        }

        .app-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .profile-card {
          background: white;
          width: 100%;
          max-width: 450px;
          border-radius: 3px;
          box-shadow: 0 17px 50px 0 rgba(11, 20, 26, .19), 0 12px 15px 0 rgba(11, 20, 26, .24);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: fadein 0.3s ease-out;
        }

        .profile-header {
          background: #f0f2f5;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          color: #41525d;
          font-weight: 500;
          font-size: 19px;
          cursor: pointer;
        }

        .back-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          color: #54656f;
        }

        .avatar-section {
          display: flex;
          justify-content: center;
          padding: 30px 0;
          background: white;
        }

        .big-avatar {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: #dfe5e7;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 80px;
          color: #fff;
          font-weight: 300;
        }

        .info-section {
          padding: 0 30px 40px 30px;
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .info-group label {
          font-size: 14px;
          color: #00a884;
          margin-bottom: 8px;
          display: block;
          font-weight: 500;
        }

        .info-value {
          font-size: 17px;
          color: #3b4a54;
          padding-bottom: 8px;
          border-bottom: 2px solid #f0f2f5;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .copy-btn {
          font-size: 12px;
          background: #e9edef;
          border: none;
          padding: 4px 10px;
          border-radius: 12px;
          cursor: pointer;
          color: #54656f;
          font-weight: 600;
        }

        .copy-btn:hover {
            background: #d1d7db;
        }

        @keyframes fadein {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="wa-green-header"></div>

      <div className="app-container">
        <div className="profile-card">
          
          {/* Header with Back Button */}
          <div className="profile-header">
            <button className="back-btn" onClick={() => navigate("/dashboard")}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
              </svg>
            </button>
            Profile
          </div>

          {/* Big Avatar */}
          <div className="avatar-section">
            <div className="big-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          </div>

          {/* User Details */}
          <div className="info-section">
            
            <div className="info-group">
              <label>Your Name</label>
              <div className="info-value">{user.name}</div>
            </div>

            <div className="info-group">
              <label>Email</label>
              <div className="info-value">{user.email}</div>
            </div>

            <div className="info-group">
              <label>User ID (Share this to chat)</label>
              <div className="info-value">
                {user.id || user._id}
                <button className="copy-btn" onClick={copyToClipboard}>
                  {copySuccess}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;