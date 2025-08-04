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
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="bg-black text-white px-3 py-1 rounded font-bold text-lg tracking-tight">
                📚 FILL-IN-FABLES
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <button className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                GAMES
              </button>
              <button className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                STORIES
              </button>
              <button className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                ABOUT
              </button>
              <button className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                HELP
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium">
                GAMES
              </button>
              <button className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium">
                STORIES
              </button>
              <button className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium">
                ABOUT
              </button>
              <button className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium">
                HELP
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Colorful Mosaic Header */}
      <div className="relative text-center py-16 md:py-24 lg:py-32 overflow-hidden">
        {/* Colorful Mosaic Background */}
        <div className="absolute inset-0 grid grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-0">
          {/* Row 1 */}
          <div className="bg-green-400 aspect-square flex items-center justify-center text-2xl">🐢</div>
          <div className="bg-teal-500 aspect-square flex items-center justify-center text-2xl">📡</div>
          <div className="bg-red-400 aspect-square flex items-center justify-center text-2xl">🏢</div>
          <div className="bg-yellow-400 aspect-square flex items-center justify-center text-2xl">🔔</div>
          <div className="bg-pink-400 aspect-square flex items-center justify-center text-2xl">🌸</div>
          <div className="bg-purple-400 aspect-square flex items-center justify-center text-2xl">🌲</div>
          <div className="bg-blue-300 aspect-square flex items-center justify-center text-2xl">☁️</div>
          <div className="bg-yellow-300 aspect-square flex items-center justify-center text-2xl">⚙️</div>
          <div className="bg-green-400 aspect-square flex items-center justify-center text-2xl md:flex hidden">🐢</div>
          <div className="bg-teal-500 aspect-square flex items-center justify-center text-2xl md:flex hidden">📡</div>
          <div className="bg-red-400 aspect-square flex items-center justify-center text-2xl md:flex hidden">🏢</div>
          <div className="bg-yellow-400 aspect-square flex items-center justify-center text-2xl md:flex hidden">🔔</div>
          <div className="bg-pink-400 aspect-square flex items-center justify-center text-2xl lg:flex hidden">🌸</div>
          <div className="bg-purple-400 aspect-square flex items-center justify-center text-2xl lg:flex hidden">🌲</div>
          <div className="bg-blue-300 aspect-square flex items-center justify-center text-2xl lg:flex hidden">☁️</div>
          <div className="bg-yellow-300 aspect-square flex items-center justify-center text-2xl lg:flex hidden">⚙️</div>
          
          {/* Row 2 */}
          <div className="bg-orange-400 aspect-square flex items-center justify-center text-2xl">🏠</div>
          <div className="bg-green-500 aspect-square flex items-center justify-center text-2xl">🌋</div>
          <div className="bg-blue-400 aspect-square flex items-center justify-center text-2xl">👁️</div>
          <div className="bg-red-300 aspect-square flex items-center justify-center text-2xl">🎸</div>
          <div className="bg-yellow-500 aspect-square flex items-center justify-center text-2xl">💡</div>
          <div className="bg-pink-300 aspect-square flex items-center justify-center text-2xl">🐙</div>
          <div className="bg-purple-300 aspect-square flex items-center justify-center text-2xl">🎯</div>
          <div className="bg-teal-400 aspect-square flex items-center justify-center text-2xl">🏠</div>
          <div className="bg-orange-400 aspect-square flex items-center justify-center text-2xl md:flex hidden">🏠</div>
          <div className="bg-green-500 aspect-square flex items-center justify-center text-2xl md:flex hidden">🌋</div>
          <div className="bg-blue-400 aspect-square flex items-center justify-center text-2xl md:flex hidden">👁️</div>
          <div className="bg-red-300 aspect-square flex items-center justify-center text-2xl md:flex hidden">🎸</div>
          <div className="bg-yellow-500 aspect-square flex items-center justify-center text-2xl lg:flex hidden">💡</div>
          <div className="bg-pink-300 aspect-square flex items-center justify-center text-2xl lg:flex hidden">🐙</div>
          <div className="bg-purple-300 aspect-square flex items-center justify-center text-2xl lg:flex hidden">🎯</div>
          <div className="bg-teal-400 aspect-square flex items-center justify-center text-2xl lg:flex hidden">🏠</div>
          
          {/* Row 3 */}
          <div className="bg-blue-500 aspect-square flex items-center justify-center text-2xl">🌊</div>
          <div className="bg-yellow-600 aspect-square flex items-center justify-center text-2xl">🌳</div>
          <div className="bg-pink-500 aspect-square flex items-center justify-center text-2xl">🎭</div>
          <div className="bg-green-300 aspect-square flex items-center justify-center text-2xl">🌿</div>
          <div className="bg-orange-300 aspect-square flex items-center justify-center text-2xl">🦋</div>
          <div className="bg-purple-500 aspect-square flex items-center justify-center text-2xl">🎨</div>
          <div className="bg-red-500 aspect-square flex items-center justify-center text-2xl">🎪</div>
          <div className="bg-teal-300 aspect-square flex items-center justify-center text-2xl">🐘</div>
          <div className="bg-blue-500 aspect-square flex items-center justify-center text-2xl md:flex hidden">🌊</div>
          <div className="bg-yellow-600 aspect-square flex items-center justify-center text-2xl md:flex hidden">🌳</div>
          <div className="bg-pink-500 aspect-square flex items-center justify-center text-2xl md:flex hidden">🎭</div>
          <div className="bg-green-300 aspect-square flex items-center justify-center text-2xl md:flex hidden">🌿</div>
          <div className="bg-orange-300 aspect-square flex items-center justify-center text-2xl lg:flex hidden">🦋</div>
          <div className="bg-purple-500 aspect-square flex items-center justify-center text-2xl lg:flex hidden">🎨</div>
          <div className="bg-red-500 aspect-square flex items-center justify-center text-2xl lg:flex hidden">🎪</div>
          <div className="bg-teal-300 aspect-square flex items-center justify-center text-2xl lg:flex hidden">🐘</div>
        </div>
        
        {/* Text Content Box */}
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border border-gray-200">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              EXPLORE HIDDEN<br />
              WORLDS, MAKE<br />
              ROBOTS, TELL STORIES
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Play, create & learn with our award-winning apps
            </p>
            <button className="bg-black text-white px-8 py-3 rounded font-semibold hover:bg-gray-800 transition-colors">
              LEARN MORE →
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {gameState === GameState.Setup && (
          <div className="space-y-8">
            {/* Mode Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Choose Your Adventure</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setMode(GameMode.Interactive)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    mode === GameMode.Interactive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Gamepad2 className="w-8 h-8 text-purple-600" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">Interactive Mode</h4>
                    <p className="text-sm text-gray-600">Fill in words step by step</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setMode(GameMode.Static)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    mode === GameMode.Static
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-orange-100 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-orange-600" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">Template Mode</h4>
                    <p className="text-sm text-gray-600">Get a printable template</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setMode(GameMode.Chatbot)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    mode === GameMode.Chatbot
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-green-100 flex items-center justify-center">
                      <Bot className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">Chat Adventure</h4>
                    <p className="text-sm text-gray-600">Interactive AI guidance</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Story Input */}
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <div className="space-y-4">
                <div>
                  <label htmlFor="story-input" className="block text-lg font-bold mb-3 text-gray-900">
                    📝 Enter Your Story
                  </label>
                  <Textarea
                    id="story-input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Once upon a time, there was a brave knight who lived in a magical castle..."
                    className="w-full h-32 md:h-40 p-4 border-2 rounded-xl text-base font-medium resize-none bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
                
                <div className="pt-4">
                  {mode === GameMode.Interactive && (
                    <button
                      onClick={handleAnalyze}
                      disabled={!inputText.trim()}
                      className="w-full px-6 py-4 rounded-xl font-bold text-lg border-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 transition-all duration-200"
                    >
                      <FileText className="w-5 h-5" />
                      Find Words to Replace
                    </button>
                  )}
                  
                  {mode === GameMode.Static && (
                    <button
                      onClick={handleGenerateTemplate}
                      disabled={!inputText.trim()}
                      className="w-full px-6 py-4 rounded-xl font-bold text-lg border-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-orange-600 border-orange-600 text-white hover:bg-orange-700 hover:border-orange-700 transition-all duration-200"
                    >
                      <FileText className="w-5 h-5" />
                      Generate Template
                    </button>
                  )}
                  
                  {mode === GameMode.Chatbot && (
                    <button
                      onClick={handleStartChatbot}
                      disabled={!inputText.trim()}
                      className="w-full px-6 py-4 rounded-xl font-bold text-lg border-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-green-600 border-green-600 text-white hover:bg-green-700 hover:border-green-700 transition-all duration-200"
                    >
                      <Bot className="w-5 h-5" />
                      Start Chat Adventure
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

        {/* How to Play Section */}
        <section className="mt-16">
          <div className="bg-white rounded-xl shadow-lg p-6 border">
            <Accordion type="single" collapsible>
              <AccordionItem value="how">
                <AccordionTrigger className="text-xl font-bold text-gray-900 hover:text-gray-700">
                  How to Play This Game
                </AccordionTrigger>
                <AccordionContent className="space-y-3 text-gray-700">
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Write or paste a story in the text area</li>
                    <li>Choose your preferred game mode</li>
                    <li>Let AI find the perfect words to replace</li>
                    <li>Add your wacky replacements</li>
                    <li>Download, share, or enjoy your hilarious creation!</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Action Buttons for Completed State */}
        {gameState === GameState.Completed && (
          <div className="flex flex-wrap gap-4 mt-8 justify-center">
            <Button 
              onClick={handleDownloadPDF}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg rounded-xl shadow-lg"
            >
              <Download className="w-5 h-5 mr-2" /> 
              Download PDF
            </Button>
            {mode !== GameMode.Static && (
              <Button 
                onClick={handleShareStory}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg rounded-xl shadow-lg"
              >
                <Share2 className="w-5 h-5 mr-2" /> 
                Share Story
              </Button>
            )}
            <Button 
              onClick={handleReset}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 text-lg rounded-xl shadow-lg"
            >
              <RefreshCw className="w-5 h-5 mr-2" /> 
              New Game
            </Button>
          </div>
        )}
      </main>

      {/* Newsletter Section */}
      <section className="bg-blue-200 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            GET OUR OCCASIONAL NEWSLETTER
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Discover wonderful story ideas and creative writing tips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
            <button className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
              SIGN UP
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}