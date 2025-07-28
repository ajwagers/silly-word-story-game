import React from 'react';
import { FileText, Bot } from 'lucide-react';
import { GameMode } from '../App';

interface GameSetupProps {
  inputText: string;
  setInputText: (text: string) => void;
  mode: GameMode;
  setMode: (mode: GameMode) => void;
  onAnalyze: () => void;
  onGenerateTemplate: () => void;
  onStartChatbot: () => void;
}

const GameSetup: React.FC<GameSetupProps> = ({
  inputText,
  setInputText,
  mode,
  setMode,
  onAnalyze,
  onGenerateTemplate,
  onStartChatbot,
}) => {
  return (
    <>
      {/* Mode Selection */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Choose your mode:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setMode(GameMode.Interactive)}
            className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 ${
              mode === GameMode.Interactive
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <h4 className="font-semibold mb-2">Interactive Mode</h4>
              <p className="text-sm text-gray-600">Fill in all words at once, then generate your story.</p>
            </div>
          </button>
          <button
            onClick={() => setMode(GameMode.Static)}
            className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 ${
              mode === GameMode.Static
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <h4 className="font-semibold mb-2">Static Mode</h4>
              <p className="text-sm text-gray-600">Get a word list and template to fill in on your own later.</p>
            </div>
          </button>
          <button
            onClick={() => setMode(GameMode.Chatbot)}
            className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 ${
              mode === GameMode.Chatbot
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <h4 className="font-semibold mb-2">Chatbot Mode</h4>
              <p className="text-sm text-gray-600">Interactive conversation with AI guidance</p>
            </div>
          </button>
        </div>
      </div>

      {/* Story Input and Start Button */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-
