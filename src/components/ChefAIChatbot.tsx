import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const API_URL = "https://chefai-chatbot-backend.onrender.com/chat";

export default function ChefAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sessionId = "demo-session"; // later connect to auth user

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userInput,
          session_id: sessionId,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      const aiMessage: Message = {
        role: "assistant",
        content: data.response || data.message || "Sorry, I couldn't process that.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error connecting to server. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FLOATING BUTTON */}
      <div className="chefai-fab-wrapper">
        {/* RIPPLE RINGS */}
        <span className="chefai-ripple-ring chefai-ripple-1"></span>
        <span className="chefai-ripple-ring chefai-ripple-2"></span>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="chefai-fab"
        >
          🤖 Ask ChefAI
        </button>
      </div>

      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="chefai-chatbox">
          <div className="chefai-header">
            ChefAI Assistant 👨‍🍳
          </div>

          <div className="chefai-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.role === "user"
                    ? "chefai-message user"
                    : "chefai-message ai"
                }
              >
                {msg.content}
              </div>
            ))}
            {loading && <div className="chefai-message ai">Typing...</div>}
          </div>

          <div className="chefai-input-area">
            <input
              type="text"
              placeholder="Ask about meals, calories..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} className="chefai-send-btn">
              Send
            </button>
          </div>
        </div>
      )}

      <style>{`
      
      /* Floating Button Wrapper */
      .chefai-fab-wrapper {
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 1000;
      }

      /* Ripple Rings */
      .chefai-ripple-ring {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        pointer-events: none;
      }

      .chefai-ripple-1 {
        background: rgba(255, 122, 24, 0.3);
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      }

      .chefai-ripple-2 {
        background: rgba(255, 122, 24, 0.2);
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }

      @keyframes ping {
        75%, 100% {
          transform: scale(2);
          opacity: 0;
        }
      }

      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }

      /* Floating Button */
      .chefai-fab {
        position: relative;
        background: linear-gradient(135deg, #ff7a18 0%, #ff6600 100%);
        color: white;
        border: none;
        padding: 14px 22px;
        border-radius: 30px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 8px 20px rgba(255, 122, 24, 0.3);
        overflow: hidden;
        transition: all 0.3s ease;
        z-index: 1001;
      }

      .chefai-fab:hover {
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 12px 30px rgba(255, 122, 24, 0.4);
      }

      /* Ripple effect */
      .chefai-fab::after,
      .chefai-send-btn::after {
        content: "";
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        background: rgba(255,255,255,0.4);
        animation: ripple 600ms linear;
      }

      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }

      /* Chatbox */
      .chefai-chatbox {
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 350px;
        height: 500px;
        background: #f6f4f1;
        border-radius: 20px;
        box-shadow: 0 15px 40px rgba(0,0,0,0.2);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      /* Header */
      .chefai-header {
        background: #ff7a18;
        color: white;
        padding: 16px;
        font-weight: 600;
      }

      /* Messages */
      .chefai-messages {
        flex: 1;
        padding: 15px;
        overflow-y: auto;
      }

      .chefai-message {
        padding: 10px 14px;
        border-radius: 16px;
        margin-bottom: 10px;
        max-width: 80%;
        font-size: 14px;
      }

      .chefai-message.user {
        background: #ff7a18;
        color: white;
        align-self: flex-end;
      }

      .chefai-message.ai {
        background: #e5e2dc;
        color: #333;
      }

      /* Input area */
      .chefai-input-area {
        display: flex;
        padding: 10px;
        border-top: 1px solid #ddd;
        background: white;
      }

      .chefai-input-area input {
        flex: 1;
        border: none;
        outline: none;
        padding: 10px;
        border-radius: 20px;
        background: #f0f0f0;
        margin-right: 8px;
      }

      .chefai-send-btn {
        background: #ff7a18;
        border: none;
        color: white;
        padding: 8px 14px;
        border-radius: 20px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }

      `}</style>
    </>
  );
}
