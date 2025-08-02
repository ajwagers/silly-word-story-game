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
  const allFieldsFilled = wordsToReplace.every(word => interactiveReplacements[word.id]?.trim());

  return (
    <div className="rounded-2xl lg:rounded-3xl shadow-2xl p-4 lg:p-8 mb-6 border-4 bg-amber-200 border-teal-600">
      <div className="mb-4">
        <h2 className="text-xl lg:text-3xl font-black text-center p-3 lg:p-4 rounded-2xl border-4 text-slate-800 bg-white border-teal-600">
          🌟 {storyTitle} 🌟
        </h2>
      </div>
      <h3 className="text-lg lg:text-2xl font-black mb-4 lg:mb-6 text-center px-2 text-slate-800">
        🎭 Replace These Words With Something SILLY! 🎭
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {wordsToReplace.map((word) => (
          <div key={word.id} className="space-y-3 p-3 lg:p-4 rounded-2xl border-4 border-dashed bg-white border-teal-600">
            <label className="block text-base lg:text-lg font-black text-center text-slate-800">
              🎯 {word.partOfSpeech.toUpperCase()}:
            </label>
            <input
              type="text"
              value={interactiveReplacements[word.id] || ''}
              onChange={(e) => onReplacementChange(word.id, e.target.value)}
              className="w-full p-3 lg:p-4 border-2 lg:border-4 rounded-2xl text-center font-bold text-base lg:text-lg shadow-inner bg-yellow-200 border-teal-600 text-slate-800 placeholder:text-slate-600 focus:border-teal-700 focus:ring-2 focus:ring-teal-200 transition-all duration-200"
              placeholder={`Silly ${word.partOfSpeech}!`}
            />
          </div>
        ))}
      </div>
      <button
        onClick={onGenerateStory}
        disabled={!allFieldsFilled}
        className="w-full lg:w-auto mt-4 lg:mt-6 flex items-center justify-center gap-3 text-white px-6 lg:px-10 py-4 lg:py-5 rounded-2xl font-black text-lg lg:text-xl shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed mx-auto border-4 bg-teal-600 border-slate-700 hover:bg-teal-700 transition-all duration-200"
      >
        <FileText className="w-6 h-6" />
        <span className="hidden lg:inline">🎉 Generate My SILLY Story! 🎉</span>
        <span className="lg:hidden">🎉 Generate Story! 🎉</span>
      </button>
    </div>
  );
};

export default InteractiveModeForm;