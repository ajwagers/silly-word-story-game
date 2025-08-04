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
    <div className="bg-white rounded-xl shadow-lg p-6 border">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2">
          🌟 {storyTitle} 🌟
        </h2>
        <p className="text-lg text-center text-gray-600">
          Replace these words with something silly!
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {wordsToReplace.map((word) => (
          <div key={word.id} className="space-y-3 p-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
            <label className="block text-lg font-bold text-center text-gray-900">
              {word.partOfSpeech.toUpperCase()}
            </label>
            <input
              type="text"
              value={interactiveReplacements[word.id] || ''}
              onChange={(e) => onReplacementChange(word.id, e.target.value)}
              className="w-full p-3 border-2 rounded-xl text-center font-medium text-base bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              placeholder={`Silly ${word.partOfSpeech}!`}
            />
          </div>
        ))}
      </div>
      
      <button
        onClick={onGenerateStory}
        disabled={!allFieldsFilled}
        className="w-full flex items-center justify-center gap-3 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 transition-all duration-200"
      >
        <FileText className="w-6 h-6" />
        Generate My Story!
      </button>
    </div>
  );
};

export default InteractiveModeForm;