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
    <div className="rounded-2xl lg:rounded-3xl shadow-2xl border-4 mb-6 bg-yellow-200 border-teal-600">
      
      {/* Chat Header */}
      <div className="p-3 lg:p-4 bg-teal-600">
        <h3 className="text-lg lg:text-2xl font-black text-white text-center">🤖 Story Bot! 🤖</h3>
      </div>
      
      {/* Chat Messages */}
      <div className="h-64 lg:h-96 overflow-y-auto p-3 lg:p-6 space-y-3 lg:space-y-4">
        {chatMessages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              message.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div className={`w-8 lg:w-12 h-8 lg:h-12 rounded-full flex items-center justify-center border-2 lg:border-4 shadow-lg flex-shrink-0 ${
              message.sender === 'bot' 
                ? 'text-white' 
                : 'text-white'
            } ${
              message.sender === 'bot' 
                ? 'bg-slate-700 border-white' 
                : 'bg-teal-600 border-white'
            }`}>
              {message.sender === 'bot' ? <Bot className="w-4 lg:w-6 h-4 lg:h-6" /> : <User className="w-4 lg:w-6 h-4 lg:h-6" />}
            </div>
            <div className={`max-w-xs lg:max-w-md px-3 lg:px-6 py-3 lg:py-4 rounded-2xl border-2 lg:border-4 shadow-lg ${
              message.sender === 'bot'
                ? 'bg-amber-200 border-slate-700 text-slate-800'
                : 'bg-teal-600 border-white text-white'
            }`}>
              <p className="text-sm lg:text-base font-bold">{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t-4 p-3 lg:p-6 border-teal-600 bg-orange-300">
        <div className="flex gap-2 lg:gap-4">
          <input
            type="text"
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your silly word!"
            className="flex-1 p-3 lg:p-4 border-4 rounded-2xl text-center font-bold text-base lg:text-lg shadow-inner bg-amber-200 border-teal-600 text-slate-800 placeholder:text-slate-600 focus:border-teal-700 focus:ring-2 focus:ring-teal-200 transition-all duration-200"
          />
          <button
            onClick={onSendMessage}
            disabled={!userResponse.trim()}
            className="text-white px-4 lg:px-8 py-3 lg:py-4 rounded-2xl font-bold lg:font-black shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed border-2 lg:border-4 bg-teal-600 border-white hover:bg-teal-700 transition-all duration-200"
          >
            <Send className="w-5 lg:w-6 h-5 lg:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;