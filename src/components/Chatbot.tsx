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
    <div className="rounded-2xl lg:rounded-3xl shadow-2xl border-4 mb-6" style={{backgroundColor: '#E9C46A', borderColor: '#2A9D8F'}}>
      
      {/* Chat Header */}
      <div className="p-3 lg:p-4" style={{backgroundColor: '#2A9D8F'}}>
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
            }`}
              style={{
                backgroundColor: message.sender === 'bot' ? '#264653' : '#2A9D8F',
                borderColor: 'white'
              }}>
              {message.sender === 'bot' ? <Bot className="w-4 lg:w-6 h-4 lg:h-6" /> : <User className="w-4 lg:w-6 h-4 lg:h-6" />}
            </div>
            <div className={`max-w-xs lg:max-w-md px-3 lg:px-6 py-3 lg:py-4 rounded-2xl border-2 lg:border-4 shadow-lg ${
              message.sender === 'bot'
                ? ''
                : ''
            }`}
              style={{
                backgroundColor: message.sender === 'bot' ? '#F9C74F' : '#2A9D8F',
                borderColor: message.sender === 'bot' ? '#264653' : 'white',
                color: message.sender === 'bot' ? '#264653' : 'white'
              }}>
              <p className="text-sm lg:text-base font-bold">{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t-4 p-3 lg:p-6" style={{borderColor: '#2A9D8F', backgroundColor: '#F4A261'}}>
        <div className="flex gap-2 lg:gap-4">
          <input
            type="text"
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your silly word!"
            className="flex-1 p-3 lg:p-4 border-2 lg:border-4 rounded-2xl text-base lg:text-lg font-bold text-center shadow-inner"
            style={{backgroundColor: '#F9C74F', borderColor: '#2A9D8F', color: '#264653'}}
          />
          <button
            onClick={onSendMessage}
            disabled={!userResponse.trim()}
            className="text-white px-4 lg:px-8 py-3 lg:py-4 rounded-2xl font-bold lg:font-black shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed border-2 lg:border-4"
            style={{backgroundColor: '#2A9D8F', borderColor: 'white'}}
          >
            <Send className="w-5 lg:w-6 h-5 lg:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;