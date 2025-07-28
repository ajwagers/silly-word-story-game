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
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-6">
      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-6 space-y-4">
        {chatMessages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              message.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              message.sender === 'bot' 
                ? 'bg-purple-100 text-purple-600' 
                : 'bg-blue-100 text-blue-600'
            }`}>
              {message.sender === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
              message.sender === 'bot'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
            }`}>
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your word here..."
            className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
          />
          <button
            onClick={onSendMessage}
            disabled={!userResponse.trim()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;