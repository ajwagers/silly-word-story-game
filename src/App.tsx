import { useState, useRef } from "react";
import {
  Sparkles,
  Gamepad2,
  BookOpen,
  Bot,
  FileText,
  PenLine,
  Download,
  Share2,
  RefreshCw,
  Menu,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import GameSetup from "./components/GameSetup";
import InteractiveModeForm, { WordToReplace } from "./components/InteractiveModeForm";
import CompletedStory, { DisplayMode } from "./components/CompletedStory";
import Chatbot, { ChatMessage } from "./components/Chatbot";
import { analyzeStory, generateStoryTemplate, downloadPDF, shareStory } from "./utils/storyUtils";

export enum GameMode {
  Interactive = 'interactive',
  Static = 'static',
  Chatbot = 'chatbot',
}

export enum GameState {
  Setup = 'setup',
  Playing = 'playing',
  Completed = 'completed',
  Chatting = 'chatting',
}

export default function StoryGameApp() {
  const [gameState, setGameState] = useState<GameState>(GameState.Setup);
  const [mode, setMode] = useState<GameMode>(GameMode.Interactive);
  const [inputText, setInputText] = useState("");
  const [wordsToReplace, setWordsToReplace] = useState<WordToReplace[]>([]);
  const [interactiveReplacements, setInteractiveReplacements] = useState<{ [key: string]: string }>({});
  const [completedStory, setCompletedStory] = useState("");
  const [staticTemplate, setStaticTemplate] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userResponse, setUserResponse] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const storyRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = () => {
    const words = analyzeStory(inputText);
    setWordsToReplace(words);
    setGameState(GameState.Playing);
  };

  const handleGenerateTemplate = () => {
    const words = analyzeStory(inputText);
    const template = generateStoryTemplate(inputText, words);
    setWordsToReplace(words);
    setStaticTemplate(template);
    setGameState(GameState.Completed);
  };

  const handleStartChatbot = () => {
    const words = analyzeStory(inputText);
    setWordsToReplace(words);
    setCurrentWordIndex(0);
    
    const initialMessage: ChatMessage = {
      sender: 'bot',
      text: `🎭 Welcome to your silly story adventure! I found ${words.length} words we can make hilarious! Let's start with the first one: I need a silly ${words[0]?.partOfSpeech}!`,
      timestamp: Date.now(),
    };
    
    setChatMessages([initialMessage]);
    setGameState(GameState.Chatting);
  };

  const handleReplacementChange = (wordId: string, value: string) => {
    setInteractiveReplacements(prev => ({
      ...prev,
      [wordId]: value
    }));
  };

  const handleGenerateStory = () => {
    let story = inputText;
    const sortedWords = [...wordsToReplace].sort((a, b) => b.position - a.position);
    
    sortedWords.forEach(word => {
      const replacement = interactiveReplacements[word.id];
      if (replacement) {
        story = story.substring(0, word.position) + replacement + story.substring(word.position + word.original.length);
      }
    });
    
    setCompletedStory(story);
    setGameState(GameState.Completed);
  };

  const handleSendMessage = () => {
    if (!userResponse.trim() || currentWordIndex >= wordsToReplace.length) return;

    const userMessage: ChatMessage = {
      sender: 'user',
      text: userResponse,
      timestamp: Date.now(),
    };

    const updatedReplacements = {
      ...interactiveReplacements,
      [wordsToReplace[currentWordIndex].id]: userResponse
    };
    setInteractiveReplacements(updatedReplacements);

    const nextIndex = currentWordIndex + 1;
    let botResponse: ChatMessage;

    if (nextIndex < wordsToReplace.length) {
      botResponse = {
        sender: 'bot',
        text: `🎉 Great choice! Now I need a silly ${wordsToReplace[nextIndex].partOfSpeech}!`,
        timestamp: Date.now() + 100,
      };
      setCurrentWordIndex(nextIndex);
    } else {
      let story = inputText;
      const sortedWords = [...wordsToReplace].sort((a, b) => b.position - a.position);
      
      sortedWords.forEach(word => {
        const replacement = updatedReplacements[word.id];
        if (replacement) {
          story = story.substring(0, word.position) + replacement + story.substring(word.position + word.original.length);
        }
      });
      
      setCompletedStory(story);
      botResponse = {
        sender: 'bot',
        text: `🎭 AMAZING! Your hilarious story is ready! Scroll down to see your masterpiece! 🎉`,
        timestamp: Date.now() + 100,
      };
      setGameState(GameState.Completed);
    }

    setChatMessages(prev => [...prev, userMessage, botResponse]);
    setUserResponse("");
  };

  const handleDownloadPDF = () => {
    const content = gameState === GameState.Completed && mode === GameMode.Static ? staticTemplate : completedStory;
    const title = mode === GameMode.Static ? "Story Template" : "Silly Story";
    downloadPDF(content, title, storyRef.current);
  };

  const handleShareStory = () => {
    shareStory(completedStory);
  };

  const handleReset = () => {
    setGameState(GameState.Setup);
    setInputText("");
    setWordsToReplace([]);
    setInteractiveReplacements({});
    setCompletedStory("");
    setStaticTemplate("");
    setChatMessages([]);
    setUserResponse("");
    setCurrentWordIndex(0);
    setMobileMenuOpen(false);
  };

  const getStoryTitle = () => {
    switch (mode) {
      case GameMode.Interactive:
        return "Interactive Story";
      case GameMode.Static:
        return "Story Template";
      case GameMode.Chatbot:
        return "Chat Story Adventure";
      default:
        return "Your Story";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 text-slate-800 font-['Quicksand',sans-serif] relative overflow-hidden">
      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b-2 border-indigo-200">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            Story Game
          </h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-indigo-100 text-indigo-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {mobileMenuOpen && (
          <div className="p-4 border-t border-indigo-200 bg-white">
            <div className="space-y-2">
              <Button
                onClick={handleReset}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                New Game
              </Button>
              {gameState === GameState.Completed && (
                <>
                  <Button
                    onClick={handleDownloadPDF}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  {mode !== GameMode.Static && (
                    <Button
                      onClick={handleShareStory}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Story
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex flex-col items-center p-4 lg:p-12 pt-20 lg:pt-12">
        {/* Desktop Header */}
        <header className="text-center mb-6 lg:mb-10 space-y-3 z-10 hidden lg:block">
          <h1 className="text-4xl lg:text-7xl font-extrabold text-indigo-700 tracking-tight">
            <span className="inline-flex items-center gap-2 flex-wrap justify-center">
              <Sparkles className="w-8 lg:w-10 h-8 lg:h-10 text-yellow-400 animate-bounce" />
              Silly Word Story Game
            </span>
          </h1>
          <p className="max-w-xl mx-auto text-lg lg:text-2xl text-indigo-500">
            Let your imagination run wild with delightfully silly stories!
          </p>
        </header>

        {/* Mobile Header */}
        <header className="text-center mb-6 space-y-2 z-10 lg:hidden">
          <p className="text-lg text-indigo-500 px-4">
            Create hilarious stories on the go!
          </p>
        </header>

        {/* Progress Bar - Hidden on mobile during setup */}
        {(gameState !== GameState.Setup || window.innerWidth >= 1024) && (
          <>
            <Progress 
              className="w-full max-w-2xl h-2 lg:h-3 rounded-full bg-slate-200 z-10 mb-2" 
              value={gameState === GameState.Setup ? 25 : gameState === GameState.Playing || gameState === GameState.Chatting ? 75 : 100} 
            />
            <div className="flex justify-between w-full max-w-2xl px-1 mb-6 lg:mb-12 text-xs lg:text-sm z-10">
              <span className="uppercase tracking-wider text-teal-700 font-semibold">Setup</span>
              <span className={`uppercase tracking-wider ${gameState === GameState.Playing || gameState === GameState.Chatting || gameState === GameState.Completed ? 'text-teal-700 font-semibold' : 'text-slate-400'}`}>
                Play
              </span>
              <span className={`uppercase tracking-wider ${gameState === GameState.Completed ? 'text-teal-700 font-semibold' : 'text-slate-400'}`}>
                Complete
              </span>
            </div>
          </>
        )}

        {/* Game Content */}
        <div className="w-full max-w-6xl z-10">
          {gameState === GameState.Setup && (
            <div className="space-y-6">
              {/* Mode Selection - Stacked on mobile */}
              <div className="bg-white rounded-2xl shadow-xl p-4 lg:p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center lg:text-left">Choose your adventure:</h3>
                <div className="grid grid-cols-1 gap-4">
                  <button
                    onClick={() => setMode(GameMode.Interactive)}
                    className={`p-4 lg:p-6 rounded-xl border-2 transition-all duration-200 ${
                      mode === GameMode.Interactive
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 lg:justify-center">
                      <Gamepad2 className="w-6 h-6 text-purple-600" />
                      <div className="text-left lg:text-center">
                        <h4 className="font-semibold text-base lg:text-lg">Interactive Mode</h4>
                        <p className="text-sm text-gray-600">Fill in words one by one, perfect for mobile!</p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setMode(GameMode.Static)}
                    className={`p-4 lg:p-6 rounded-xl border-2 transition-all duration-200 ${
                      mode === GameMode.Static
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 lg:justify-center">
                      <FileText className="w-6 h-6 text-orange-600" />
                      <div className="text-left lg:text-center">
                        <h4 className="font-semibold text-base lg:text-lg">Template Mode</h4>
                        <p className="text-sm text-gray-600">Get a printable template to share with friends!</p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setMode(GameMode.Chatbot)}
                    className={`p-4 lg:p-6 rounded-xl border-2 transition-all duration-200 ${
                      mode === GameMode.Chatbot
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 lg:justify-center">
                      <Bot className="w-6 h-6 text-green-600" />
                      <div className="text-left lg:text-center">
                        <h4 className="font-semibold text-base lg:text-lg">Chat Adventure</h4>
                        <p className="text-sm text-gray-600">Interactive conversation with AI guidance</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Story Input */}
              <div className="bg-white rounded-2xl shadow-xl p-4 lg:p-6 border border-gray-100">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="story-input" className="block text-lg font-semibold mb-2 text-center lg:text-left text-slate-700">
                      📝 Enter your story:
                    </label>
                    <textarea
                      id="story-input"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Once upon a time, there was a brave knight who lived in a magical castle..."
                      className="w-full h-32 lg:h-40 p-4 border-2 rounded-xl text-base lg:text-lg font-medium resize-none bg-amber-100 border-teal-500 text-slate-800 placeholder:text-slate-600 focus:border-teal-600 focus:ring-2 focus:ring-teal-200 transition-all duration-200"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    {mode === GameMode.Interactive && (
                      <button
                        onClick={handleAnalyze}
                        disabled={!inputText.trim()}
                        className="w-full px-6 py-4 rounded-xl font-bold text-lg border-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-teal-600 border-slate-700 text-white hover:bg-teal-700 transition-all duration-200"
                      >
                        <FileText className="w-5 h-5" />
                        🎯 Find Words to Replace!
                      </button>
                    )}
                    
                    {mode === GameMode.Static && (
                      <button
                        onClick={handleGenerateTemplate}
                        disabled={!inputText.trim()}
                        className="w-full px-6 py-4 rounded-xl font-bold text-lg border-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-orange-500 border-slate-700 text-white hover:bg-orange-600 transition-all duration-200"
                      >
                        <FileText className="w-5 h-5" />
                        📋 Generate Template!
                      </button>
                    )}
                    
                    {mode === GameMode.Chatbot && (
                      <button
                        onClick={handleStartChatbot}
                        disabled={!inputText.trim()}
                        className="w-full px-6 py-4 rounded-xl font-bold text-lg border-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-yellow-400 border-slate-700 text-slate-800 hover:bg-yellow-500 transition-all duration-200"
                      >
                        <Bot className="w-5 h-5" />
                        🤖 Start Chat Adventure!
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {gameState === GameState.Playing && mode === GameMode.Interactive && (
            <InteractiveModeForm
              storyTitle={getStoryTitle()}
              wordsToReplace={wordsToReplace}
              interactiveReplacements={interactiveReplacements}
              onReplacementChange={handleReplacementChange}
              onGenerateStory={handleGenerateStory}
            />
          )}

          {gameState === GameState.Chatting && mode === GameMode.Chatbot && (
            <Chatbot
              chatMessages={chatMessages}
              userResponse={userResponse}
              setUserResponse={setUserResponse}
              onSendMessage={handleSendMessage}
            />
          )}

          {gameState === GameState.Completed && (
            <CompletedStory
              ref={storyRef}
              storyTitle={getStoryTitle()}
              completedStory={completedStory}
              staticTemplate={staticTemplate}
              wordsToReplace={wordsToReplace}
              displayMode={mode === GameMode.Static ? DisplayMode.Template : DisplayMode.Story}
              onDownloadPDF={handleDownloadPDF}
              onShareStory={handleShareStory}
              onReset={handleReset}
            />
          )}
        </div>

        {/* How to Play - Collapsible on mobile */}
        <section className="w-full max-w-4xl mt-8 lg:mt-14 z-10">
          <Accordion type="single" collapsible defaultValue={window.innerWidth >= 1024 ? "how" : undefined}>
            <AccordionItem value="how">
              <AccordionTrigger className="text-lg lg:text-xl font-semibold text-indigo-700 hover:text-indigo-800 transition-colors duration-200 px-4 lg:px-0">
                How to Play This Awesome Game
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-indigo-600 text-sm lg:text-base px-4 lg:px-0">
                <ul className="list-decimal list-inside space-y-2">
                  <li className="hover:text-indigo-800 transition-colors duration-200">Write or paste a story in the text area.</li>
                  <li className="hover:text-indigo-800 transition-colors duration-200">Choose your preferred game mode.</li>
                  <li className="hover:text-indigo-800 transition-colors duration-200">Let AI find the perfect words to replace.</li>
                  <li className="hover:text-indigo-800 transition-colors duration-200">Add your wacky replacements.</li>
                  <li className="hover:text-indigo-800 transition-colors duration-200">Download, share, or enjoy your hilarious creation!</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Desktop Action Buttons */}
        {gameState === GameState.Completed && (
          <div className="hidden lg:flex gap-4 mt-8">
            <Button 
              onClick={handleDownloadPDF}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 text-lg rounded-full shadow-lg hover:scale-105 transition-all duration-200"
            >
              <Download className="w-5 h-5 mr-2" /> 
              Download PDF
            </Button>
            {mode !== GameMode.Static && (
              <Button 
                onClick={handleShareStory}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 text-lg rounded-full shadow-lg hover:scale-105 transition-all duration-200"
              >
                <Share2 className="w-5 h-5 mr-2" /> 
                Share Story
              </Button>
            )}
            <Button 
              onClick={handleReset}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 text-lg rounded-full shadow-lg hover:scale-105 transition-all duration-200"
            >
              <RefreshCw className="w-5 h-5 mr-2" /> 
              New Game
            </Button>
          </div>
        )}

        {/* Mobile Bottom Padding */}
        <div className="h-20 lg:hidden"></div>
      </main>

      {/* Install PWA Prompt */}
      <div id="pwa-install-prompt" className="hidden fixed bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:w-80 bg-indigo-600 text-white p-4 rounded-xl shadow-2xl z-50">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold">Install App</h4>
            <p className="text-sm opacity-90">Add to home screen for quick access!</p>
          </div>
          <button id="pwa-install-button" className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold">
            Install
          </button>
        </div>
      </div>
    </div>
  );
}