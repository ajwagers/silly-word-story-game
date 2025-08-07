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

  // This useEffect hook was causing the page to scroll down with every new message.
  // It's commented out to keep the chat interface stable during the conversation.
  // useEffect(() => {
  //   chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [chatMessages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border">
      
      {/* Chat Header */}
      <div className="p-4 bg-green-600 rounded-t-xl">
        <h3 className="text-xl md:text-2xl font-bold text-white text-center">🤖 Story Bot 🤖</h3>
      </div>
      
      {/* Chat Messages */}
      <div className="h-64 md:h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {chatMessages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              message.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-lg flex-shrink-0 ${
              message.sender === 'bot' 
                ? 'bg-green-600 border-green-700 text-white' 
                : 'bg-blue-600 border-blue-700 text-white'
            }`}>
              {message.sender === 'bot' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div className={`max-w-xs md:max-w-md px-4 py-3 rounded-xl border shadow-lg ${
              message.sender === 'bot'
                ? 'bg-white border-gray-300 text-gray-900'
                : 'bg-blue-600 border-blue-700 text-white'
            }`}>
              <p className="text-sm md:text-base font-medium">{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t p-6 bg-white rounded-b-xl">
        <div className="flex gap-4">
          <input
            type="text"
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your silly word!"
            className="flex-1 p-3 border-2 rounded-xl text-center font-medium text-base bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          />
          <button
            onClick={onSendMessage}
            disabled={!userResponse.trim()}
            className="text-white px-6 py-3 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 transition-all duration-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;