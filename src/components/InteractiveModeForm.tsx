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
    <div className="rounded-2xl lg:rounded-3xl shadow-2xl p-4 lg:p-8 mb-6 border-4" style={{backgroundColor: '#F9C74F', borderColor: '#2A9D8F'}}>
      <div className="mb-4">
        <h2 className="text-xl lg:text-3xl font-black text-center p-3 lg:p-4 rounded-2xl border-4" style={{color: '#264653', backgroundColor: 'white', borderColor: '#2A9D8F'}}>
          🌟 {storyTitle} 🌟
        </h2>
      </div>
      <h3 className="text-lg lg:text-2xl font-black mb-4 lg:mb-6 text-center px-2" style={{color: '#264653'}}>
        🎭 Replace These Words With Something SILLY! 🎭
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {wordsToReplace.map((word) => (
          <div key={word.id} className="space-y-3 p-3 lg:p-4 rounded-2xl border-4 border-dashed" style={{backgroundColor: 'white', borderColor: '#2A9D8F'}}>
            <label className="block text-base lg:text-lg font-black text-center" style={{color: '#264653'}}>
              🎯 {word.partOfSpeech.toUpperCase()}:
            </label>
            <input
              type="text"
              value={interactiveReplacements[word.id] || ''}
              onChange={(e) => onReplacementChange(word.id, e.target.value)}
              className="w-full p-3 lg:p-4 border-4 rounded-xl text-center font-bold text-base lg:text-lg shadow-inner"
              style={{backgroundColor: '#E9C46A', borderColor: '#2A9D8F', color: '#264653'}}
              placeholder={`Silly ${word.partOfSpeech}!`}
            />
          </div>
        ))}
      </div>
      <button
        onClick={onGenerateStory}
        disabled={!allFieldsFilled}
        className="w-full lg:w-auto mt-4 lg:mt-6 flex items-center justify-center gap-3 text-white px-6 lg:px-10 py-4 lg:py-5 rounded-2xl font-black text-lg lg:text-xl shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed mx-auto border-4"
        style={{backgroundColor: '#2A9D8F', borderColor: '#264653'}}
      >
        <FileText className="w-6 h-6" />
        <span className="hidden lg:inline">🎉 Generate My SILLY Story! 🎉</span>
        <span className="lg:hidden">🎉 Generate Story! 🎉</span>
      </button>
    </div>
  );
};

export default InteractiveModeForm;