import { useState, useRef, useEffect } from "react";
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
import { getRandomStoryFromDb } from "./utils/dbUtils";

// Generate mosaic tiles data
const colors = [
  'bg-green-400', 'bg-teal-500', 'bg-red-400', 'bg-yellow-400', 'bg-pink-400', 
  'bg-purple-400', 'bg-blue-300', 'bg-yellow-300', 'bg-orange-400', 'bg-green-500',
  'bg-blue-400', 'bg-red-300', 'bg-yellow-500', 'bg-pink-300', 'bg-purple-300',
  'bg-teal-400', 'bg-blue-500', 'bg-yellow-600', 'bg-pink-500', 'bg-green-300',
  'bg-orange-300', 'bg-purple-500', 'bg-red-500', 'bg-teal-300'
];

const emojis = [
  '🐢', '📡', '🏢', '🔔', '🌸', '🌲', '☁️', '⚙️', '🏠', '🌋',
  '👁️', '🎸', '💡', '🐙', '🎯', '🌊', '🌳', '🎭', '🌿', '🦋',
  '🎨', '🎪', '🐘', '🚀', '🎮', '📚', '🎵', '🌟', '🎈', '🎁',
  '🌺', '🦄', '🌈', '🎊', '🎉', '🎀', '🎂', '🍭', '🌙', '⭐'
];

const generateMosaicTiles = () => {
  const tiles = [];
  for (let i = 0; i < 200; i++) {
    tiles.push({
      id: i,
      color: colors[i % colors.length],
      emoji: emojis[i % emojis.length]
    });
  }
  return tiles;
};

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
  // State management for the entire application
  const [gameState, setGameState] = useState<GameState>(GameState.Setup);
  const [mode, setMode] = useState<GameMode>(GameMode.Interactive);
  const [inputText, setInputText] = useState("");
  const [wordsToReplace, setWordsToReplace] = useState<WordToReplace[]>([]);
  const [interactiveReplacements, setInteractiveReplacements] = useState<{ [key: string]: string }>({});
  const [completedStory, setCompletedStory] = useState(""); // Holds the final story with HTML for highlighting
  const [staticTemplate, setStaticTemplate] = useState("");
  const [hiddenStory, setHiddenStory] = useState(""); // Stores the story when 'Load Random' is used
  const [isUsingRandomStory, setIsUsingRandomStory] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userResponse, setUserResponse] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoadingStory, setIsLoadingStory] = useState(false);
  const [mosaicTiles, setMosaicTiles] = useState(generateMosaicTiles);
  const [animatingTileId, setAnimatingTileId] = useState<number | null>(null);
  
  const storyRef = useRef<HTMLDivElement>(null);
  const gameSetupRef = useRef<HTMLDivElement>(null);
  const howToPlayRef = useRef<HTMLDivElement>(null);
  const interactiveFormRef = useRef<HTMLDivElement>(null);
  const chatbotSectionRef = useRef<HTMLDivElement>(null);

  // Background tile animation effect
  useEffect(() => {
    const animationInterval = setInterval(() => {
      // Select a random tile to animate
      const randomIndex = Math.floor(Math.random() * mosaicTiles.length);
      const tileToAnimate = mosaicTiles[randomIndex];
      
      // Start the animation
      setAnimatingTileId(tileToAnimate.id);
      
      // Change the tile's content halfway through the animation
      setTimeout(() => {
        setMosaicTiles(prevTiles => 
          prevTiles.map(tile => 
            tile.id === tileToAnimate.id
              ? {
                  ...tile,
                  color: colors[Math.floor(Math.random() * colors.length)],
                  emoji: emojis[Math.floor(Math.random() * emojis.length)]
                }
              : tile
          )
        );
      }, 250); // Halfway through the 500ms animation
      
      // End the animation
      setTimeout(() => {
        setAnimatingTileId(null);
      }, 500);
    }, 1500); // Animate a tile every 1.5 seconds

    return () => {
      clearInterval(animationInterval);
    };
  }, [mosaicTiles.length]);

  // Analyzes the story to find words for interactive mode
  const handleAnalyze = () => {
    const storyToAnalyze = isUsingRandomStory ? hiddenStory : inputText;
    const words = analyzeStory(storyToAnalyze);
    setWordsToReplace(words);
    setGameState(GameState.Playing);
    
    // Scroll to the interactive form after a brief delay
    setTimeout(() => {
      interactiveFormRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  // Generates a fill-in-the-blanks style template for static mode
  const handleGenerateTemplate = () => {
    const storyToAnalyze = isUsingRandomStory ? hiddenStory : inputText;
    const words = analyzeStory(storyToAnalyze);
    const template = generateStoryTemplate(storyToAnalyze, words);
    setWordsToReplace(words);
    setStaticTemplate(template);
    setGameState(GameState.Completed);
  };

  // Initializes the chatbot mode with a welcome message
  const handleStartChatbot = () => {
    const storyToAnalyze = isUsingRandomStory ? hiddenStory : inputText;
    const words = analyzeStory(storyToAnalyze);
    setWordsToReplace(words);
    setCurrentWordIndex(0);
    
    const initialMessage: ChatMessage = {
      sender: 'bot',
      text: `🎭 Welcome to your silly story adventure! I found ${words.length} words we can make hilarious! Let's start with the first one: I need a silly ${words[0]?.partOfSpeech}!`,
      timestamp: Date.now(),
    };
    
    setChatMessages([initialMessage]);
    setGameState(GameState.Chatting);
    
    // Scroll to center the chatbot window
    //3
    // setTimeout(() => {
    //  chatbotSectionRef.current?.scrollIntoView({
    //    behavior: 'smooth',
    //    block: 'center'
    //  });
    //}, 100);
  };

  // Updates the user's word replacements for interactive mode
  const handleReplacementChange = (wordId: string, value: string) => {
    setInteractiveReplacements(prev => ({
      ...prev,
      [wordId]: value
    }));
  };

  // Generates the final story by replacing original words with the user's new words.
  function handleGenerateStory() {
    const originalStory = isUsingRandomStory ? hiddenStory : inputText;
    const newStoryParts: string[] = [];
    let currentIndex = 0;

    // Sort words by position in ascending order to build the new string sequentially.
    const sortedWords = [...wordsToReplace].sort((a, b) => a.position - b.position);

    // This robust approach builds the new story from pieces, avoiding errors
    // from modifying the string while iterating over it. It also gracefully
    // handles any potential overlapping matches from the analysis step.
    sortedWords.forEach(word => {
      const replacement = interactiveReplacements[word.id];

      // Ensure we don't process a word that overlaps with a previous one that has already been processed.
      if (replacement && word.position >= currentIndex) {
        // Add the text from the last index up to the current word's position
        newStoryParts.push(originalStory.substring(currentIndex, word.position));

        // The replacement is wrapped in HTML to be styled in the final output.
        // The CompletedStory component must render this string as HTML.
        const highlightedReplacement = `<span class="font-bold underline text-blue-600">${replacement.trim()}</span>`;
        newStoryParts.push(highlightedReplacement);
        
        // Update the current index to be after the original word that was replaced.
        currentIndex = word.position + word.original.length;
      }
    });

    // Add any remaining part of the story after the last replacement.
    if (currentIndex < originalStory.length) {
      newStoryParts.push(originalStory.substring(currentIndex));
    }

    setCompletedStory(newStoryParts.join(''));
    setGameState(GameState.Completed);

    // Scroll to the completed story after a brief delay
    //1
    //setTimeout(() => {
    //  storyRef.current?.scrollIntoView({
    //    behavior: 'smooth',
    //    block: 'start'
    //  });
    //}, 100);
  };

  // Handles the conversation flow in chatbot mode
  const handleSendMessage = () => {
    if (!userResponse.trim() || currentWordIndex >= wordsToReplace.length) return;

    const userMessage: ChatMessage = {
      sender: 'user',
      text: userResponse,
      timestamp: Date.now(),
    };

    // Store the user's word
    const updatedReplacements = {
      ...interactiveReplacements,
      [wordsToReplace[currentWordIndex].id]: userResponse
    };
    setInteractiveReplacements(updatedReplacements);

    const nextIndex = currentWordIndex + 1;
    let botResponse: ChatMessage;

    // If there are more words to replace, ask for the next one
    if (nextIndex < wordsToReplace.length) {
      botResponse = {
        sender: 'bot',
        text: `🎉 Great choice! Now I need a silly ${wordsToReplace[nextIndex].partOfSpeech}!`,
        timestamp: Date.now() + 100,
      };
      setCurrentWordIndex(nextIndex);
    } else { 
      // Otherwise, the game is over. Generate the final story.
      // This robust approach builds the new story from pieces, avoiding errors
      // from modifying the string while iterating over it.
      const originalStory = isUsingRandomStory ? hiddenStory : inputText;
      const newStoryParts: string[] = [];
      let currentIndex = 0;

      // Sort words by position in ascending order to build the new string sequentially.
      const sortedWords = [...wordsToReplace].sort((a, b) => a.position - b.position);

      sortedWords.forEach(word => {
        const replacement = updatedReplacements[word.id];

        // Ensure we don't process a word that overlaps with a previous one.
        if (replacement && word.position >= currentIndex) {
          // Add the text from the last index up to the current word's position
          newStoryParts.push(originalStory.substring(currentIndex, word.position));

          // The replacement is wrapped in HTML to be styled in the final output.
          const highlightedReplacement = `<span class="font-bold underline text-blue-600">${replacement.trim()}</span>`;
          newStoryParts.push(highlightedReplacement);
          
          // Update the current index to be after the original word that was replaced.
          currentIndex = word.position + word.original.length;
        }
      });
      
      // Add any remaining part of the story after the last replacement.
      if (currentIndex < originalStory.length) {
        newStoryParts.push(originalStory.substring(currentIndex));
      }
      
      setCompletedStory(newStoryParts.join(''));

      botResponse = {
        sender: 'bot',
        text: `🎭 AMAZING! Your hilarious story is ready! Scroll down to see your masterpiece! 🎉`,
        timestamp: Date.now() + 100,
      };
      setGameState(GameState.Completed);
      
      // Scroll to the completed story after a brief delay
      //2
      // setTimeout(() => {
      //  storyRef.current?.scrollIntoView({ 
      //    behavior: 'smooth',
      //    block: 'start'
      //  });
      //}, 500);
    }

    setChatMessages(prev => [...prev, userMessage, botResponse]);
    setUserResponse("");
  };

  // Fetches a random story from the database utils
  const handleLoadRandomStory = async () => {
    setIsLoadingStory(true);
    try {
      const randomStory = await getRandomStoryFromDb();
      setHiddenStory(randomStory);
      setIsUsingRandomStory(true);
      setInputText(""); // Clear the visible input
    
    // Scroll to the completed story after a brief delay
    setTimeout(() => {
      storyRef.current?.scrollIntoView({   // This was incorrectly scrolling to storyRef, which is
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
    } catch (error) {
      console.error('Error loading random story:', error);
      alert('Sorry, could not load a random story. Please try again or enter your own story.');
    } finally {
      setIsLoadingStory(false);
    }
  };

  // Triggers the PDF download utility
  const handleDownloadPDF = () => {
    const content = gameState === GameState.Completed && mode === GameMode.Static ? staticTemplate : completedStory;
    const title = mode === GameMode.Static ? "Story Template" : "Silly Story";
    downloadPDF(content, title, storyRef.current);
  };

  // Triggers the Web Share API utility
  const handleShareStory = () => {
    shareStory(completedStory);
  };

  // Resets all state to their initial values to start a new game
  const handleReset = () => {
    setGameState(GameState.Setup);
    setInputText("");
    setHiddenStory("");
    setIsUsingRandomStory(false);
    setWordsToReplace([]);
    setInteractiveReplacements({});
    setCompletedStory("");
    setStaticTemplate("");
    setChatMessages([]);
    setUserResponse("");
    setCurrentWordIndex(0);
    setMobileMenuOpen(false);
  };

  // Helper functions for smooth scrolling to different sections
  const scrollToGameSetup = () => {
    gameSetupRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
    setMobileMenuOpen(false);
  };
  
  const scrollToHowToPlay = () => {
    howToPlayRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
    setMobileMenuOpen(false);
  };
  
  // Gets a dynamic title for the story based on the current game mode
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
    <div className="min-h-screen relative">
      {/* Full-page mosaic background */}
      <div className="fixed inset-0 grid grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-0 z-0 overflow-hidden">
        {mosaicTiles.map((tile) => (
          <div 
            key={tile.id}
            className={`${tile.color} aspect-square flex items-center justify-center text-lg md:text-xl lg:text-2xl transition-all duration-500 ease-in-out transform ${
              animatingTileId === tile.id ? 'animate-tile-flip' : ''
            }`}
          >
            {tile.emoji}
          </div>
        ))}
      </div>

      {/* Content overlay */}
      <div className="relative z-10">
        {/* Navigation Header */}
        <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-20">
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
                <button 
                  onClick={scrollToGameSetup}
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  MAKE STORIES
                </button>
                <button className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  ABOUT US
                </button>
                <button 
                  onClick={scrollToHowToPlay}
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  GET HELP
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
            <div className="md:hidden bg-white/95 backdrop-blur-sm border-t px-4 py-4 space-y-2">
              <button 
                onClick={scrollToGameSetup}
                className="block w-full text-left text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                MAKE STORIES
              </button>
              <button className="block w-full text-left text-gray-600 hover:text-gray-900 font-medium transition-colors">
                ABOUT US
              </button>
              <button 
                onClick={scrollToHowToPlay}
                className="block w-full text-left text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                GET HELP
              </button>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="text-center py-16 md:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border border-gray-200">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                MAKE YOUR OWN<br />
                HILARIOUS STORIES — <br />
                just add YOUR words!
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Ever wanted to be the author of the silliest story ever? Pick some wacky words, fill in the blanks, and watch your tale come to life! Every time you play, your story is different—giggles guaranteed.
              </p>
              <button 
                onClick={scrollToGameSetup}
                className="bg-black text-white px-8 py-3 rounded font-semibold hover:bg-gray-800 transition-colors"
              >
                LETS GET STARTED!
              </button>
            </div>
          </div>
        </section>

        {/* Game Setup Section - Always Visible */}
        <section ref={gameSetupRef} className="max-w-6xl mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Mode Selection */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border">
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
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border">
              <div className="space-y-4">
                <div>
                  <label htmlFor="story-input" className="block text-lg font-bold mb-3 text-slate-800">
                    📝 Enter Your Story
                  </label>
                  <Textarea
                    id="story-input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={isUsingRandomStory ? "🎲 Random story loaded! Choose your game mode to start playing..." : "Once upon a time, there was a brave knight who lived in a magical castle..."}
                    disabled={isUsingRandomStory}
                    className="w-full h-32 md:h-40 p-4 border-2 rounded-xl text-base font-medium resize-none bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleLoadRandomStory}
                    disabled={isLoadingStory}
                    className="flex-1 px-4 py-3 rounded-xl font-bold text-base border-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-purple-600 border-purple-600 text-white hover:bg-purple-700 hover:border-purple-700 transition-all duration-200"
                  >
                    <Sparkles className="w-5 h-5" />
                    {isLoadingStory ? 'Loading...' : 'Load Random Story'}
                  </button>
                  
                  {inputText.trim() && (
                    <button
                      onClick={() => {
                        setInputText('');
                        setHiddenStory('');
                        setIsUsingRandomStory(false);
                      }}
                      className="px-4 py-3 rounded-xl font-bold text-base border-2 bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 hover:border-gray-400 transition-all duration-200"
                    >
                      Clear
                    </button>
                  )}
                  
                  {isUsingRandomStory && (
                    <button
                      onClick={() => {
                        setHiddenStory('');
                        setIsUsingRandomStory(false);
                      }}
                      className="px-4 py-3 rounded-xl font-bold text-base border-2 bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 hover:border-gray-400 transition-all duration-200"
                    >
                      Clear Random Story
                    </button>
                  )}
                </div>
                
                <div className="pt-4">
                  {mode === GameMode.Interactive && (
                    <button
                      onClick={handleAnalyze}
                      disabled={!inputText.trim() && !isUsingRandomStory}
                      className="w-full px-6 py-4 rounded-xl font-bold text-lg border-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 transition-all duration-200"
                    >
                      <FileText className="w-5 h-5" />
                      Find Words to Replace
                    </button>
                  )}
                  
                  {mode === GameMode.Static && (
                    <button
                      onClick={handleGenerateTemplate}
                      disabled={!inputText.trim() && !isUsingRandomStory}
                      className="w-full px-6 py-4 rounded-xl font-bold text-lg border-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-orange-600 border-orange-600 text-white hover:bg-orange-700 hover:border-orange-700 transition-all duration-200"
                    >
                      <FileText className="w-5 h-5" />
                      Generate Template
                    </button>
                  )}
                  
                  {mode === GameMode.Chatbot && (
                    <button
                      onClick={handleStartChatbot}
                      disabled={!inputText.trim() && !isUsingRandomStory}
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
        </section>

        {/* Game Content Section */}
        {(gameState === GameState.Playing || gameState === GameState.Chatting || gameState === GameState.Completed) && (
          <section 
            ref={gameState === GameState.Playing ? interactiveFormRef : gameState === GameState.Chatting ? chatbotSectionRef : undefined}
            className="max-w-6xl mx-auto px-4 py-8 min-h-[600px]"
          >
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
                interactiveReplacements={interactiveReplacements}
                displayMode={mode === GameMode.Static ? DisplayMode.Template : DisplayMode.Story}
                onDownloadPDF={handleDownloadPDF}
                onShareStory={handleShareStory}
                onReset={handleReset}
              />
            )}
          </section>
        )}

        {/* How to Play Section - Always Visible */}
        <section ref={howToPlayRef} className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border">
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

        {/* Newsletter Section - Always Visible */}
        <section className="bg-yellow-200/95 backdrop-blur-sm py-16">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              SIGN UP FOR OUR IRREGULAR NEWSLETTER <br />
              (we don't send it out very often)
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Keep up on what is new, discover new story ideas, and collect creative writing tips.
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
    </div>
  );
}