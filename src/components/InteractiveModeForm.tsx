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
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center">{storyTitle}</h2>
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Replace these words:</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {wordsToReplace.map((word) => (
          <div key={word.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-600">
              {word.partOfSpeech}:
            </label>
            <input
              type="text"
              value={interactiveReplacements[word.id] || ''}
              onChange={(e) => onReplacementChange(word.id, e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
              placeholder={`Enter a ${word.partOfSpeech}...`}
            />
          </div>
        ))}
      </div>
      <button
        onClick={onGenerateStory}
        className="mt-4 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        <FileText className="w-4 h-4" />
        Generate Silly Story
      </button>
    </div>
  );
};

export default InteractiveModeForm;