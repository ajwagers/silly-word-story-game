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
    <div className="rounded-3xl shadow-2xl border-4 mb-6" style={{backgroundColor: '#E9C46A', borderColor: '#2A9D8F'}}>
      
      {/* Chat Header */}
      <div className="p-4" style={{backgroundColor: '#2A9D8F'}}>
        <h3 className="text-2xl font-black text-white text-center">🤖 Chat with Your Story Bot! 🤖</h3>
      </div>
      
      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-6 space-y-4">
        {chatMessages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              message.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 shadow-lg ${
              message.sender === 'bot' 
                ? 'text-white' 
                : 'text-white'
            }`}>
              style={{
                backgroundColor: message.sender === 'bot' ? '#264653' : '#2A9D8F',
                borderColor: 'white'
              }}
            >
              {message.sender === 'bot' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
            </div>
            <div className={`max-w-xs lg:max-w-md px-6 py-4 rounded-2xl border-4 shadow-lg ${
              message.sender === 'bot'
                ? ''
                : ''
            }`}>
              style={{
                backgroundColor: message.sender === 'bot' ? '#F9C74F' : '#2A9D8F',
                borderColor: message.sender === 'bot' ? '#264653' : 'white',
                color: message.sender === 'bot' ? '#264653' : 'white'
              }}
            >
              <p className="text-base font-bold">{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t-4 p-6" style={{borderColor: '#2A9D8F', backgroundColor: '#F4A261'}}>
        <div className="flex gap-4">
          <input
            type="text"
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="🌈 Type your silly word here! 🌈"
            className="flex-1 p-4 border-4 rounded-2xl text-lg font-bold text-center shadow-inner"
            style={{backgroundColor: '#F9C74F', borderColor: '#2A9D8F', color: '#264653'}}
          />
          <button
            onClick={onSendMessage}
            disabled={!userResponse.trim()}
            className="text-white px-8 py-4 rounded-2xl font-black shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed border-4"
            style={{backgroundColor: '#2A9D8F', borderColor: 'white'}}
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;