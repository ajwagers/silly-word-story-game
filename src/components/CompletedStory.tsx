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
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{storyTitle}</h2>
        <div className="flex gap-3">
          <button
            onClick={onDownloadPDF}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
          {!isTemplate && (
            <button
              onClick={onShareStory}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          )}
          <button
            onClick={onReset}
            className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            {isTemplate ? 'New Template' : 'New Game'}
          </button>
        </div>
      </div>
      
      {isTemplate ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Word List */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3">Words Needed:</h4>
            <ol className="list-decimal list-inside space-y-1">
              {wordsToReplace.map((word, index) => (
                <li key={word.id} className="text-blue-700">
                  {word.partOfSpeech}
                </li>
              ))}
            </ol>
          </div>
          
          {/* Template Story */}
          <div 
            ref={ref}
            className="bg-yellow-50 p-4 rounded-xl border border-yellow-200"
          >
            <h4 className="font-semibold text-yellow-800 mb-3">Story Template:</h4>
            <p className="text-gray-800 leading-relaxed">
              {content}
            </p>
          </div>
        </div>
      ) : (
        <div 
          ref={ref}
          className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border-2 border-yellow-200"
        >
          <p className="text-lg leading-relaxed text-gray-800 font-medium">
            {content}
          </p>
        </div>
      )}
    </div>
  );
});

CompletedStory.displayName = 'CompletedStory';

export default CompletedStory;