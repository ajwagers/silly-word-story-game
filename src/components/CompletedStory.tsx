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
    <div className="rounded-2xl lg:rounded-3xl shadow-2xl p-4 lg:p-8 border-4 mb-6 bg-yellow-200 border-teal-600">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 space-y-4 lg:space-y-0">
        <h2 className="text-xl lg:text-3xl font-black text-center p-3 lg:p-4 rounded-2xl border-4 text-slate-800 bg-white border-teal-600">
          🎉 {storyTitle} 🎉
        </h2>
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-4">
          <button
            onClick={onDownloadPDF}
            className="flex items-center justify-center gap-2 text-white px-4 lg:px-6 py-3 rounded-2xl font-bold lg:font-black shadow-xl border-4 text-sm lg:text-base bg-orange-500 border-white hover:bg-orange-600 transition-all duration-200"
          >
            <Download className="w-4 lg:w-5 h-4 lg:h-5" />
            📄 PDF
          </button>
          {!isTemplate && (
            <button
              onClick={onShareStory}
              className="flex items-center justify-center gap-2 text-white px-4 lg:px-6 py-3 rounded-2xl font-bold lg:font-black shadow-xl border-4 text-sm lg:text-base bg-teal-600 border-white hover:bg-teal-700 transition-all duration-200"
            >
              <Share2 className="w-4 lg:w-5 h-4 lg:h-5" />
              📤 Share
            </button>
          )}
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 text-white px-4 lg:px-6 py-3 rounded-2xl font-bold lg:font-black shadow-xl border-4 text-sm lg:text-base bg-slate-700 border-white hover:bg-slate-800 transition-all duration-200"
          >
            <RefreshCw className="w-4 lg:w-5 h-4 lg:h-5" />
            🔄 {isTemplate ? 'New Template' : 'New Game'}
          </button>
        </div>
      </div>
      
      {isTemplate ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 relative z-10">
          {/* Word List */}
          <div className="p-4 lg:p-6 rounded-2xl border-4 shadow-xl bg-orange-200 border-teal-600">
            <h4 className="font-black mb-4 text-lg lg:text-xl text-center text-slate-800">🎯 Words You Need:</h4>
            <ol className="list-none space-y-2 lg:space-y-3">
              {wordsToReplace.map((word, index) => (
                <li key={word.id} className="p-2 lg:p-3 rounded-xl border-2 font-bold flex items-center gap-2 lg:gap-3 text-sm lg:text-base bg-white border-teal-600 text-slate-800">
                  <span className="text-white w-6 lg:w-8 h-6 lg:h-8 rounded-full flex items-center justify-center font-black text-xs lg:text-sm bg-teal-600">
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
            className="p-4 lg:p-6 rounded-2xl border-4 shadow-xl bg-amber-200 border-teal-600"
          >
            <h4 className="font-black mb-4 text-lg lg:text-xl text-center text-slate-800">📝 Your Story Template:</h4>
            <p className="leading-relaxed font-bold text-base lg:text-lg p-3 lg:p-4 rounded-xl border-2 text-slate-800 bg-white border-teal-600">
              {content}
            </p>
          </div>
        </div>
      ) : (
        <div 
          ref={ref}
          className="p-4 lg:p-8 rounded-2xl border-4 shadow-2xl bg-amber-200 border-teal-600"
        >
          <div className="p-4 lg:p-6 rounded-2xl border-4 bg-white border-orange-400">
            <h4 className="font-black mb-4 text-lg lg:text-2xl text-center text-slate-800">🎭 Your HILARIOUS Story! 🎭</h4>
            <p className="text-base lg:text-xl leading-relaxed font-bold text-center text-slate-800">
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