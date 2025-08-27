import React from 'react';
import { FileText, HelpCircle } from 'lucide-react';
import { wordTypeDefinitions, capitalize } from '../utils/wordDefinitions';

export interface WordToReplace {
  id: string;
  original: string;
  partOfSpeech: string;
  tense?: string;
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
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2">
          🌟 {storyTitle} 🌟
        </h2>
        <p className="text-lg text-center text-gray-600">
          Replace these words with something silly!
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {wordsToReplace.map((word) => {
          const fullWordType = `${word.partOfSpeech}${word.tense ? ` (${word.tense})` : ''}`;
          
          // Construct the key for the definitions map.
          // This handles cases like 'verb (past tense)' by looking up 'verb (past tense)' first,
          // and falling back to just 'verb' if the specific tense isn't defined.
          const definitionKey = word.tense ? `${word.partOfSpeech} (${word.tense})` : word.partOfSpeech;
          const definition = wordTypeDefinitions[definitionKey.toLowerCase()] || wordTypeDefinitions[word.partOfSpeech.toLowerCase()] || 'A type of word.';
          
          const capitalizedWordType = capitalize(word.partOfSpeech);

          return (
            <div key={word.id} className="space-y-3 p-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
              <div className="flex items-center justify-center gap-2">
                <label className="block text-lg font-bold text-center text-gray-900">
                  {word.partOfSpeech.toUpperCase()}
                  {word.tense && ` (${word.tense.toUpperCase()})`}
                </label>
                <div className="relative flex items-center group">
                  <HelpCircle className="h-5 w-5 text-gray-500 cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                    <p className="text-left"><span className="font-bold">{capitalizedWordType}:</span> {definition}</p>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-800"></div>
                  </div>
                </div>
              </div>
              <input
                type="text"
                value={interactiveReplacements[word.id] || ''}
                onChange={(e) => onReplacementChange(word.id, e.target.value)}
                className="w-full p-3 border-2 rounded-xl text-center font-medium text-base bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                placeholder={`Silly ${fullWordType}!`}
              />
            </div>
          );
        })}
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