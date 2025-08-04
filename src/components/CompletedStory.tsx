import React, { forwardRef } from 'react';
import { Download, Share2, RefreshCw } from 'lucide-react';
import { WordToReplace } from './InteractiveModeForm';

export enum DisplayMode {
  Story = 'story',
  Template = 'template',
}

interface CompletedStoryProps {
  storyTitle: string;
  completedStory?: string;
  staticTemplate?: string;
  wordsToReplace: WordToReplace[];
  displayMode: DisplayMode;
  onDownloadPDF: () => void;
  onShareStory: () => void;
  onReset: () => void;
}

const CompletedStory = forwardRef<HTMLDivElement, CompletedStoryProps>(({
  storyTitle,
  completedStory,
  staticTemplate,
  wordsToReplace,
  displayMode,
  onDownloadPDF,
  onShareStory,
  onReset,
}, ref) => {
  const isTemplate = displayMode === DisplayMode.Template;
  const content = isTemplate ? staticTemplate : completedStory;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <h2 className="text-2xl md:text-3xl font-bold text-center md:text-left text-gray-900">
          🎉 {storyTitle} 🎉
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onDownloadPDF}
            className="flex items-center justify-center gap-2 text-white px-4 py-3 rounded-xl font-bold shadow-lg bg-green-600 hover:bg-green-700 transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
          {!isTemplate && (
            <button
              onClick={onShareStory}
              className="flex items-center justify-center gap-2 text-white px-4 py-3 rounded-xl font-bold shadow-lg bg-blue-600 hover:bg-blue-700 transition-all duration-200"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          )}
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 text-white px-4 py-3 rounded-xl font-bold shadow-lg bg-gray-600 hover:bg-gray-700 transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            New Game
          </button>
        </div>
      </div>
      
      {isTemplate ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Word List */}
          <div className="p-6 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
            <h4 className="font-bold mb-4 text-xl text-center text-gray-900">Words You Need:</h4>
            <ol className="list-none space-y-3">
              {wordsToReplace.map((word, index) => (
                <li key={word.id} className="p-3 rounded-xl border font-bold flex items-center gap-3 bg-white border-gray-300 text-gray-900">
                  <span className="text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-blue-600">
                    {index + 1}
                  </span>
                  {word.partOfSpeech.toUpperCase()}
                </li>
              ))}
            </ol>
          </div>
          
          {/* Template Story */}
          <div 
            ref={ref}
            className="p-6 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50"
          >
            <h4 className="font-bold mb-4 text-xl text-center text-gray-900">Your Story Template:</h4>
            <p className="leading-relaxed font-medium text-lg p-4 rounded-xl border text-gray-900 bg-white border-gray-300">
              {content}
            </p>
          </div>
        </div>
      ) : (
        <div 
          ref={ref}
          className="p-6 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50"
        >
          <div className="p-6 rounded-xl bg-white border border-gray-300">
            <h4 className="font-bold mb-4 text-xl md:text-2xl text-center text-gray-900">🎭 Your Hilarious Story! 🎭</h4>
            <p className="text-lg md:text-xl leading-relaxed font-medium text-center text-gray-900">
              {content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

CompletedStory.displayName = 'CompletedStory';

export default CompletedStory;