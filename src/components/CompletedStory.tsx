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
    <div className="bg-gradient-to-br from-green-100 to-yellow-100 rounded-3xl shadow-2xl p-8 border-4 border-green-400 mb-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-green-200/20 to-yellow-200/20 animate-pulse"></div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-black text-green-800 bg-white/80 p-4 rounded-2xl border-4 border-green-500 relative z-10">
          🎉 {storyTitle} 🎉
        </h2>
        <div className="flex gap-4 relative z-10">
          <button
            onClick={onDownloadPDF}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-2xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 font-black shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 border-4 border-white"
          >
            <Download className="w-5 h-5" />
            📄 PDF
          </button>
          {!isTemplate && (
            <button
              onClick={onShareStory}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-2xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 font-black shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 border-4 border-white"
            >
              <Share2 className="w-5 h-5" />
              📤 Share
            </button>
          )}
          <button
            onClick={onReset}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-2xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 font-black shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 border-4 border-white"
          >
            <RefreshCw className="w-5 h-5" />
            🔄 {isTemplate ? 'New Template' : 'New Game'}
          </button>
        </div>
      </div>
      
      {isTemplate ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          {/* Word List */}
          <div className="bg-gradient-to-br from-blue-200 to-purple-200 p-6 rounded-2xl border-4 border-blue-400 shadow-xl">
            <h4 className="font-black text-blue-800 mb-4 text-xl text-center">🎯 Words You Need:</h4>
            <ol className="list-none space-y-3">
              {wordsToReplace.map((word, index) => (
                <li key={word.id} className="bg-white/80 p-3 rounded-xl border-2 border-blue-300 font-bold text-blue-800 flex items-center gap-3">
                  <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-sm">
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
            className="bg-gradient-to-br from-yellow-200 to-orange-200 p-6 rounded-2xl border-4 border-yellow-400 shadow-xl"
          >
            <h4 className="font-black text-yellow-800 mb-4 text-xl text-center">📝 Your Story Template:</h4>
            <p className="text-gray-800 leading-relaxed font-bold text-lg bg-white/60 p-4 rounded-xl border-2 border-yellow-300">
              {content}
            </p>
          </div>
        </div>
      ) : (
        <div 
          ref={ref}
          className="bg-gradient-to-r from-yellow-200 to-orange-200 p-8 rounded-2xl border-4 border-yellow-400 shadow-2xl relative z-10"
        >
          <div className="bg-white/80 p-6 rounded-2xl border-4 border-orange-300">
            <h4 className="font-black text-orange-800 mb-4 text-2xl text-center">🎭 Your HILARIOUS Story! 🎭</h4>
            <p className="text-xl leading-relaxed text-gray-800 font-bold text-center">
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