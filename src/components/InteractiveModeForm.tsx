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
    <div className="rounded-3xl shadow-2xl p-8 mb-6 border-4" style={{backgroundColor: '#F9C74F', borderColor: '#2A9D8F'}}>
      <div className="mb-4">
        <h2 className="text-3xl font-black text-center p-4 rounded-2xl border-4" style={{color: '#264653', backgroundColor: 'white', borderColor: '#2A9D8F'}}>
          🌟 {storyTitle} 🌟
        </h2>
      </div>
      <h3 className="text-2xl font-black mb-6 text-center" style={{color: '#264653'}}>
        🎭 Replace These Words With Something SILLY! 🎭
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {wordsToReplace.map((word) => (
          <div key={word.id} className="space-y-3 p-4 rounded-2xl border-4 border-dashed" style={{backgroundColor: 'white', borderColor: '#2A9D8F'}}>
            <label className="block text-lg font-black text-center" style={{color: '#264653'}}>
              🎯 {word.partOfSpeech.toUpperCase()}:
            </label>
            <input
              type="text"
              value={interactiveReplacements[word.id] || ''}
              onChange={(e) => onReplacementChange(word.id, e.target.value)}
              className="w-full p-4 border-4 rounded-xl text-center font-bold text-lg shadow-inner"
              style={{backgroundColor: '#E9C46A', borderColor: '#2A9D8F', color: '#264653'}}
              placeholder={`🌈 Enter a silly ${word.partOfSpeech}! 🌈`}
            />
          </div>
        ))}
      </div>
      <button
        onClick={onGenerateStory}
        className="mt-6 flex items-center gap-3 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed mx-auto border-4"
        style={{backgroundColor: '#2A9D8F', borderColor: '#264653'}}
      >
        <FileText className="w-6 h-6" />
        🎉 Generate My SILLY Story! 🎉
      </button>
    </div>
  );
};

export default InteractiveModeForm;