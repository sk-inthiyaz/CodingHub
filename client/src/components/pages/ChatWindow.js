import React from "react";
import CodeExplanation from "./CodeExplanation";
import "./ChatWindow.css";

function isPlainMessage(content) {
  return (
    content.trim().startsWith("👋 Hi! I'm a code explainer bot.") ||
    content.trim() === "This is AI Coding Assistance . Please enter code to get an explanation."
  );
}

function ChatWindow({ messages, isLoading, isDark }) {
  return (
    <div className="chat-window">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`message-row ${msg.role === "user" ? "user" : "ai"}`}
        >
          <div
            className={`message-bubble ${msg.role === "user" ? "user-bubble" : "ai-bubble"}`}
          >
            {msg.role === "ai" ? (
              isPlainMessage(msg.content) ? (
                <div className="ai-plain-message">{msg.content}</div>
              ) : (
                <CodeExplanation response={msg.content} isDark={isDark} />
              )
            ) : (
              msg.content
            )}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="message-row ai">
          <div className="message-bubble ai-bubble loading">Thinking...</div>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
