import React from 'react';
import { HelpCircle } from 'lucide-react';
import { wordTypeDefinitions, capitalize } from '../utils/wordDefinitions';

interface WordInputWithTooltipProps {
  wordType: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  index: number;
}

const WordInputWithTooltip: React.FC<WordInputWithTooltipProps> = ({ wordType, value, onChange, index }) => {
  const definition = wordTypeDefinitions[wordType.toLowerCase()] || 'a type of word.';
  const capitalizedWordType = capitalize(wordType);
  const exampleText = definition.split('(e.g., ')[1]?.replace(').', '') || 'word';

  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <label htmlFor={`word-${index}`} className="font-bold text-lg text-gray-700 dark:text-gray-200">
          Enter a/an {wordType}
        </label>
        <div className="relative flex items-center group ml-2">
          <HelpCircle className="h-5 w-5 text-gray-500 dark:text-gray-400 cursor-help" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
            <p><span className="font-bold">{capitalizedWordType}:</span> {definition}</p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-800"></div>
          </div>
        </div>
      </div>
      <input
        id={`word-${index}`}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={`e.g., ${exampleText}`}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        required
      />
    </div>
  );
};

export default WordInputWithTooltip;