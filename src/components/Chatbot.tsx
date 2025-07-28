import React, { useRef, useEffect } from 'react';
import { Bot, User, Send } from 'lucide-react';

export interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
  timestamp: number;
}

interface ChatbotProps {
  chatMessages: ChatMessage[];
  userResponse: string;
  setUserResponse: (value: string) => void;
  onSendMessage: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({
  chatMessages,
  userResponse,
  setUserResponse,
  onSendMessage,
}) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="bg-blue-200 rounded-3xl shadow-2xl border-4 border-blue-500 mb-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-300/30 animate-pulse"></div>
      
      {/* Chat Header */}
      <div className="bg-blue-600 p-4 relative z-10">
        <h3 className="text-2xl font-black text-white text-center">🤖 Chat with Your Story Bot! 🤖</h3>
      </div>
      
      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-6 space-y-4 relative z-10">
        {chatMessages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              message.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-lg ${
              message.sender === 'bot' 
                ? 'bg-purple-500 text-white' 
                : 'bg-green-500 text-white'
            }`}>
              {message.sender === 'bot' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
            </div>
            <div className={`max-w-xs lg:max-w-md px-6 py-4 rounded-2xl border-4 shadow-lg transform hover:scale-105 transition-all duration-200 ${
              message.sender === 'bot'
                ? 'bg-yellow-300 text-purple-800 border-yellow-500'
                : 'bg-blue-500 text-white border-white'
            }`}>
              <p className="text-base font-bold">{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t-4 border-blue-400 p-6 bg-pink-200 relative z-10">
        <div className="flex gap-4">
          <input
            type="text"
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="🌈 Type your silly word here! 🌈"
            className="flex-1 p-4 border-4 border-yellow-400 rounded-2xl focus:border-pink-600 focus:ring-4 focus:ring-pink-300 transition-all duration-300 text-lg font-bold text-center bg-yellow-100 shadow-inner"
          />
          <button
            onClick={onSendMessage}
            disabled={!userResponse.trim()}
            className="bg-green-500 text-white px-8 py-4 rounded-2xl hover:bg-green-600 transition-all duration-300 font-black shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-4 border-white"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;