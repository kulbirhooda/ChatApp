import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import useAuth from "../context/authContext";
import auth from "../lib/auth";
import axios from "../api/axios";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const messagesEndRef = useRef(null);

  /* ---------------- helpers ---------------- */
  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const loadConversations = async () => {
    const { data } = await axios.get("/api/user/friends");
    setConversations(data);
  };

  const getOtherUser = (conv) =>
    conv.userA.id === user.id ? conv.userB : conv.userA;

  /* ---------------- socket ---------------- */
  useEffect(() => {
    const s = io("http://localhost:4444", {
      auth: { token: auth.token },
    });

    s.on("chat:new", async (msg) => {
      // if no active conversation, activate it
      if (!activeConv) {
        setActiveConv(msg.conversationId);
        localStorage.setItem("lastConversation", msg.conversationId);
        setMessages([msg]);
        await loadConversations();
        return;
      }

      // append only if it belongs to current conversation
      if (msg.conversationId === activeConv) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    setSocket(s);
    return () => s.disconnect();
  }, [activeConv]);

  /* ---------------- initial load ---------------- */
  useEffect(() => {
    loadConversations();
  }, []);

  /* ---------------- restore on refresh ---------------- */
  useEffect(() => {
    if (conversations.length === 0) return;

    const last = localStorage.getItem("lastConversation");
    const conv =
      conversations.find((c) => c.id === last) || conversations[0];

    openConversation(conv);
  }, [conversations]);

  /* ---------------- open conversation ---------------- */
  const openConversation = async (conv) => {
    setActiveConv(conv.id);
    localStorage.setItem("lastConversation", conv.id);

    const { data } = await axios.get("/api/user/messages", {
      params: { conversationId: conv.id },
    });

    setMessages(data);
  };

  /* ---------------- new chat ---------------- */
  const startNewChat = async () => {
    const id = prompt("Enter User ID");
    if (!id) return;

    socket.emit("chat:send", { receiverId: id, text: "👋" }, async () => {
      await loadConversations();
    });
  };

  /* ---------------- send message ---------------- */
  const sendMessage = (e) => {
    e.preventDefault();
    if (!text || !activeConv) return;

    const conv = conversations.find((c) => c.id === activeConv);
    const receiverId = getOtherUser(conv).id;

    socket.emit("chat:send", { receiverId, text });
    setText("");
  };

  useEffect(scrollToBottom, [messages]);

  /* ---------------- UI ---------------- */
  const activeConversation = conversations.find(
    (c) => c.id === activeConv
  );
  const chatUser = activeConversation
    ? getOtherUser(activeConversation)
    : null;

  return (
    <>
      <style>{`
        body { margin:0; font-family: system-ui; background:#d1d7db; }
        .app { height:100vh; display:flex; justify-content:center; padding:18px; }
        .container { width:100%; max-width:1600px; background:white; display:flex; }
        .sidebar { width:30%; min-width:300px; border-right:1px solid #d1d7db; display:flex; flex-direction:column; }
        .sidebar-header { height:60px; background:#f0f2f5; display:flex; align-items:center; justify-content:space-between; padding:0 15px; }
        .avatar { width:40px; height:40px; border-radius:50%; background:#dfe5e7; display:flex; align-items:center; justify-content:center; cursor:pointer; font-weight:600; }
        .actions button { background:none; border:none; font-size:20px; cursor:pointer; margin-left:12px; }
        .friends { flex:1; overflow-y:auto; }
        .friend { padding:14px; cursor:pointer; border-bottom:1px solid #f0f2f5; }
        .friend.active { background:#f0f2f5; }
        .chat { flex:1; display:flex; flex-direction:column; background:#efeae2; }
        .chat-header { height:60px; background:#f0f2f5; display:flex; align-items:center; padding:0 16px; border-bottom:1px solid #d1d7db; font-weight:600; }
        .messages { flex:1; padding:20px 60px; overflow-y:auto; }
        .msg { margin-bottom:8px; max-width:65%; padding:6px 10px; border-radius:7px; font-size:14px; }
        .mine { background:#d9fdd3; margin-left:auto; }
        .theirs { background:white; }
        .footer { background:#f0f2f5; padding:10px; display:flex; gap:10px; }
        .footer input { flex:1; padding:10px; border-radius:8px; border:none; }
        .footer button { border:none; background:none; font-size:18px; cursor:pointer; }
      `}</style>

      <div className="app">
        <div className="container">
          {/* SIDEBAR */}
          <div className="sidebar">
            <div className="sidebar-header">
              <div className="avatar" onClick={() => navigate("/profile")}>
                {user.name[0].toUpperCase()}
              </div>
              <div className="actions">
                <button onClick={startNewChat}>+</button>
                <button onClick={logout}>⎋</button>
              </div>
            </div>

            <div className="friends">
              {conversations.map((c) => {
                const other = getOtherUser(c);
                return (
                  <div
                    key={c.id}
                    className={`friend ${
                      activeConv === c.id ? "active" : ""
                    }`}
                    onClick={() => openConversation(c)}
                  >
                    {other.name}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CHAT */}
          {chatUser ? (
            <div className="chat">
              <div className="chat-header">{chatUser.name}</div>

              <div className="messages">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`msg ${
                      m.sender.id === user.id ? "mine" : "theirs"
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form className="footer" onSubmit={sendMessage}>
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message"
                />
                <button type="submit">➤</button>
              </form>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
