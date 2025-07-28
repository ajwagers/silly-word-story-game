import React from 'react';
import { FileText } from 'lucide-react';

export interface WordToReplace {
  id: string;
  original: string;
  partOfSpeech: string;
  replacement?: string;
  index: number;
  position: number;
}

interface InteractiveModeFormProps {
  storyTitle: string;
  wordsToReplace: WordToReplace[];
  interactiveReplacements: { [key: string]: string };
  onReplacementChange: (wordId: string, value: string) => void;
  onGenerateStory: () => void;
}

const InteractiveModeForm: React.FC<InteractiveModeFormProps> = ({
  storyTitle,
  wordsToReplace,
  interactiveReplacements,
  onReplacementChange,
  onGenerateStory,
}) => {
  return (
    <div className="bg-gradient-to-br from-yellow-100 to-pink-100 rounded-3xl shadow-2xl p-8 mb-6 border-4 border-rainbow-gradient relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/20 to-pink-200/20 animate-pulse"></div>
      <div className="mb-4">
        <h2 className="text-3xl font-black text-purple-800 text-center relative z-10 bg-white/60 p-4 rounded-2xl border-4 border-purple-400">
          🌟 {storyTitle} 🌟
        </h2>
      </div>
      <h3 className="text-2xl font-black text-pink-800 mb-6 text-center relative z-10">
        🎭 Replace These Words With Something SILLY! 🎭
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative z-10">
        {wordsToReplace.map((word) => (
          <div key={word.id} className="space-y-3 bg-white/80 p-4 rounded-2xl border-3 border-dashed border-purple-400 hover:border-pink-400 transition-all duration-300 transform hover:scale-105">
            <label className="block text-lg font-black text-purple-700 text-center">
              🎯 {word.partOfSpeech.toUpperCase()}:
            </label>
            <input
              type="text"
              value={interactiveReplacements[word.id] || ''}
              onChange={(e) => onReplacementChange(word.id, e.target.value)}
              className="w-full p-4 border-4 border-yellow-300 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-200 transition-all duration-300 text-center font-bold text-lg bg-gradient-to-r from-yellow-50 to-orange-50 shadow-inner"
              placeholder={`🌈 Enter a silly ${word.partOfSpeech}! 🌈`}
            />
          </div>
        ))}
      </div>
      <button
        onClick={onGenerateStory}
        className="mt-6 flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-5 rounded-2xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 font-black text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mx-auto relative z-10 border-4 border-white"
      >
        <FileText className="w-6 h-6" />
        🎉 Generate My SILLY Story! 🎉
      </button>
    </div>
  );
};

export default InteractiveModeForm;