import React, { useState, useRef, useEffect } from 'react';
import { Download, Share2, RefreshCw, FileText, Send, Bot, User } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import nlp from 'compromise';

interface WordToReplace {
  id: string;
  original: string;
  partOfSpeech: string;
  replacement?: string;
  index: number;
  position: number; // Position in original text
}

interface StoryData {
  title: string;
  wordsToReplace: WordToReplace[];
}

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
  timestamp: number;
}

function App() {
  const [inputText, setInputText] = useState('The quick brown fox jumps over the lazy dog. The beautiful princess danced gracefully in the moonlight while the brave knight fought the terrible dragon.');
  const [mode, setMode] = useState<'interactive' | 'static' | 'chatbot'>('interactive');
  const [wordsToReplace, setWordsToReplace] = useState<WordToReplace[]>([]);
  const [storyTitle, setStoryTitle] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [completedStory, setCompletedStory] = useState('');
  const [staticTemplate, setStaticTemplate] = useState('');
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'completed'>('setup');
  const [interactiveReplacements, setInteractiveReplacements] = useState<{[key: string]: string}>({});
  const storyRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const generateStoryTitle = (text: string, words: WordToReplace[]): string => {
    const titles = [
      "The Amazing Adventure",
      "A Wild Tale",
      "The Incredible Story",
      "An Unexpected Journey",
      "The Mysterious Case",
      "A Fantastic Adventure",
      "The Great Escape",
      "An Extraordinary Day",
      "The Secret Mission",
      "A Magical Experience",
      "The Epic Quest",
      "An Unusual Discovery",
      "The Wonderful World",
      "A Thrilling Adventure",
      "The Amazing Discovery"
    ];
    
    // Try to create a more specific title based on content
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('princess') || lowerText.includes('castle') || lowerText.includes('dragon')) {
      return "The Fairy Tale Adventure";
    } else if (lowerText.includes('space') || lowerText.includes('planet') || lowerText.includes('alien')) {
      return "The Space Adventure";
    } else if (lowerText.includes('ocean') || lowerText.includes('sea') || lowerText.includes('ship')) {
      return "The Ocean Adventure";
    } else if (lowerText.includes('forest') || lowerText.includes('tree') || lowerText.includes('animal')) {
      return "The Forest Adventure";
    } else if (lowerText.includes('school') || lowerText.includes('teacher') || lowerText.includes('student')) {
      return "The School Story";
    } else if (lowerText.includes('family') || lowerText.includes('home') || lowerText.includes('house')) {
      return "The Family Adventure";
    }
    
    // Use a random title from the list
    return titles[Math.floor(Math.random() * titles.length)];
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const analyzeTextForReplacements = (text: string): StoryData => {
    const doc = nlp(text);
    const allWords = text.split(/\s+/);
    const targetWordCount = Math.floor(allWords.length / 6); // 1 word per 6 words on average
    
    // Get all potential words with their positions
    const potentialWords: Array<{word: string, pos: string, position: number, textIndex: number}> = [];
    
    // Extract nouns, verbs, and adjectives with their positions
    const nouns = doc.nouns().json();
    const verbs = doc.verbs().json();
    const adjectives = doc.adjectives().json();
    
    // Add nouns
    nouns.forEach((noun: any) => {
      const wordText = noun.text.toLowerCase();
      const position = text.toLowerCase().indexOf(wordText);
      if (position !== -1) {
        potentialWords.push({
          word: noun.text,
          pos: 'noun',
          position: position,
          textIndex: Math.floor(position / (text.length / allWords.length))
        });
      }
    });
    
    // Add verbs
    verbs.forEach((verb: any) => {
      const wordText = verb.text.toLowerCase();
      const position = text.toLowerCase().indexOf(wordText);
      if (position !== -1) {
        potentialWords.push({
          word: verb.text,
          pos: 'verb',
          position: position,
          textIndex: Math.floor(position / (text.length / allWords.length))
        });
      }
    });
    
    // Add adjectives
    adjectives.forEach((adj: any) => {
      const wordText = adj.text.toLowerCase();
      const position = text.toLowerCase().indexOf(wordText);
      if (position !== -1) {
        potentialWords.push({
          word: adj.text,
          pos: 'adjective',
          position: position,
          textIndex: Math.floor(position / (text.length / allWords.length))
        });
      }
    });
    
    // Sort by position and select evenly distributed words
    potentialWords.sort((a, b) => a.position - b.position);
    
    const selectedWords: WordToReplace[] = [];
    const minDistance = Math.floor(allWords.length / targetWordCount);
    let lastSelectedIndex = -minDistance;
    
    potentialWords.forEach((word, index) => {
      if (selectedWords.length < targetWordCount && 
          word.textIndex - lastSelectedIndex >= minDistance) {
        selectedWords.push({
          id: `${word.pos}-${selectedWords.length}`,
          original: word.word,
          partOfSpeech: word.pos,
          index: selectedWords.length,
          position: word.position
        });
        lastSelectedIndex = word.textIndex;
      }
    });

    const title = generateStoryTitle(text, selectedWords);
    
    return {
      title,
      wordsToReplace: selectedWords
    };
  };

  const startChatbotGame = () => {
    const storyData = analyzeTextForReplacements(inputText);
    setWordsToReplace(storyData.wordsToReplace);
    setStoryTitle(storyData.title);
    setCurrentWordIndex(0);
    setGameState('playing');
    
    const welcomeMessage: ChatMessage = {
      sender: 'bot',
      text: "Hi there! I've analyzed your story and found some words we can replace to make it silly! Let's start creating your funny story together! 🎭",
      timestamp: Date.now()
    };

    const firstQuestion: ChatMessage = {
      sender: 'bot',
      text: storyData.wordsToReplace.length > 0 
        ? `I need a ${storyData.wordsToReplace[0].partOfSpeech}. Can you give me one?`
        : "I couldn't find any words to replace. Try a different story!",
      timestamp: Date.now() + 1
    };

    setChatMessages([welcomeMessage, firstQuestion]);
  };

  const generateInteractiveStory = () => {
    const storyData = analyzeTextForReplacements(inputText);
    const words = storyData.wordsToReplace;
    let result = inputText;
    
    words.forEach(word => {
      const replacement = interactiveReplacements[word.id];
      if (replacement) {
        result = result.replace(new RegExp(`\\b${word.original}\\b`, 'i'), replacement);
      }
    });

    setCompletedStory(result);
    setGameState('completed');
  };

  const generateStaticTemplate = () => {
    const storyData = analyzeTextForReplacements(inputText);
    setWordsToReplace(storyData.wordsToReplace);
    setStoryTitle(storyData.title);
    
    // Create a copy to modify
    let template = inputText; 
    // Sort words by position to replace from the end, avoiding index shifts
    const sortedWords = [...storyData.wordsToReplace].sort((a, b) => b.position - a.position);

    sortedWords.forEach((word, i) => {
      const indexInOriginalList = storyData.wordsToReplace.findIndex(w => w.id === word.id);
      // Use position to replace the exact word, preventing issues with duplicate words
      template = template.substring(0, word.position) + `(${indexInOriginalList + 1})` + template.substring(word.position + word.original.length);
    });

    setStaticTemplate(template);
    setGameState('completed');
  };

  const handleInteractiveReplacementChange = (wordId: string, value: string) => {
    setInteractiveReplacements(prev => ({
      ...prev,
      [wordId]: value
    }));
  };

  const handleUserResponse = () => {
    if (!userResponse.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      sender: 'user',
      text: userResponse,
      timestamp: Date.now()
    };

    setChatMessages(prev => [...prev, userMessage]);

    // Update the current word with user's replacement
    const updatedWords = [...wordsToReplace];
    updatedWords[currentWordIndex].replacement = userResponse.trim();
    setWordsToReplace(updatedWords);

    // Clear input
    setUserResponse('');

    // Check if we have more words to replace
    if (currentWordIndex + 1 < wordsToReplace.length) {
      const nextIndex = currentWordIndex + 1;
      setCurrentWordIndex(nextIndex);
      
      const nextWord = wordsToReplace[nextIndex];
      const botResponse: ChatMessage = {
        sender: 'bot',
        text: `Great choice! Now I need a ${nextWord.partOfSpeech}. What would you like to use?`,
        timestamp: Date.now() + 100
      };

      setTimeout(() => {
        setChatMessages(prev => [...prev, botResponse]);
      }, 500);
    } else {
      // All words collected, generate the story
      const completionMessage: ChatMessage = {
        sender: 'bot',
        text: "Perfect! I have all the words I need. Let me create your silly story! 🎉",
        timestamp: Date.now() + 100
      };

      setTimeout(() => {
        setChatMessages(prev => [...prev, completionMessage]);
        generateSillyStory(updatedWords);
      }, 500);
    }
  };

  const generateSillyStory = (words: WordToReplace[]) => {
    let result = inputText;
    
    words.forEach(word => {
      if (word.replacement) {
        // Replace first occurrence of the original word
        result = result.replace(new RegExp(`\\b${word.original}\\b`, 'i'), word.replacement);
      }
    });

    setCompletedStory(result);
    setGameState('completed');

    const finalMessage: ChatMessage = {
      sender: 'bot',
      text: "Ta-da! Here's your silly story! You can download it as a PDF or share it with friends. Want to create another one?",
      timestamp: Date.now() + 1000
    };

    setTimeout(() => {
      setChatMessages(prev => [...prev, finalMessage]);
    }, 1000);
  };

  const downloadPDF = async () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Title
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(storyTitle || 'Silly Word Story Game', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 25;

    // Word list section - compact two-column layout
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Words Needed:', margin, yPosition);
    yPosition += 15;
    
    // Two-column word list
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    
    const columnWidth = (pageWidth - (margin * 3)) / 2;
    const itemsPerColumn = Math.ceil(wordsToReplace.length / 2);
    
    wordsToReplace.forEach((word, index) => {
      const column = Math.floor(index / itemsPerColumn);
      const rowInColumn = index % itemsPerColumn;
      const xPos = margin + (column * (columnWidth + margin));
      const yPos = yPosition + (rowInColumn * 15);
      
      const lineText = `${index + 1}) ${word.partOfSpeech}`;
      pdf.text(lineText, xPos, yPos);
      
      // Draw a line for writing after the text
      const textWidth = pdf.getTextWidth(lineText);
      const lineStartX = xPos + textWidth + 5;
      const lineEndX = xPos + columnWidth - 5;
      pdf.setDrawColor(0, 0, 0);
      pdf.line(lineStartX, yPos + 2, lineEndX, yPos + 2);
    });
    
    // Move to story section
    yPosition += (itemsPerColumn * 15) + 20;
    
    // Story section
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Your Story:', margin, yPosition);
    yPosition += 15;
    
    // Create story with numbered blanks and underlines
    let storyWithBlanks = inputText;
    wordsToReplace.forEach((word, index) => {
      storyWithBlanks = storyWithBlanks.replace(new RegExp(`\\b${word.original}\\b`, 'i'), `(${index + 1}) ___________`);
    });
    
    // Split story into lines
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    
    const lines = pdf.splitTextToSize(storyWithBlanks, pageWidth - (margin * 2));
    
    lines.forEach((line: string) => {
      pdf.text(line, margin, yPosition);
      yPosition += 14;
    });

    pdf.save('silly-word-story.pdf');
  };

  const shareStory = async () => {
    const shareText = `Check out my silly story: "${completedStory}"`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Silly Word Story',
          text: shareText,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Story copied to clipboard!');
      } catch (error) {
        console.error('Could not copy text: ', error);
      }
    }
  };

  const resetGame = () => {
    setWordsToReplace([]);
    setChatMessages([]);
    setCurrentWordIndex(0);
    setStoryTitle('');
    setUserResponse('');
    setCompletedStory('');
    setStaticTemplate('');
    setInteractiveReplacements({});
    setGameState('setup');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserResponse();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Silly Word Story Game
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Let AI find words in your story and replace them with silly alternatives!</p>
        </div>

        {/* Mode Selection */}
        {gameState === 'setup' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Choose your mode:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setMode('interactive')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 ${
                  mode === 'interactive'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Interactive Mode</h4>
                  <p className="text-sm text-gray-600">Fill in all words at once, then generate your story</p>
                </div>
              </button>
              <button
                onClick={() => setMode('static')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 ${
                  mode === 'static'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Static Mode</h4>
                  <p className="text-sm text-gray-600">Get a word list and template to fill in on your own later.</p>
                </div>
              </button>
              <button
                onClick={() => setMode('chatbot')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 ${
                  mode === 'chatbot'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Chatbot Mode</h4>
                  <p className="text-sm text-gray-600">Interactive conversation with AI guidance</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Setup Phase */}
        {gameState === 'setup' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Enter your complete story:
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 resize-none"
              placeholder="Write a complete story here. I'll find words to make it silly!"
            />
            
            {mode === 'interactive' ? (
              <button
                onClick={() => {
                  const words = analyzeTextForReplacements(inputText);
                  setWordsToReplace(words);
                  setGameState('playing');
                }}
                disabled={!inputText.trim()}
                className="mt-4 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <FileText className="w-4 h-4" />
                Analyze Story
              </button>
            ) : mode === 'static' ? (
              <button
                onClick={generateStaticTemplate}
                disabled={!inputText.trim()}
                className="mt-4 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <FileText className="w-4 h-4" />
                Generate Template
              </button>
            ) : (
              <button
                onClick={startChatbotGame}
                disabled={!inputText.trim()}
                className="mt-4 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Bot className="w-4 h-4" />
                Start Chatbot Game
              </button>
            )}
          </div>
        )}

        {/* Interactive Mode Form */}
        {gameState === 'playing' && mode === 'interactive' && wordsToReplace.length > 0 && (
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
                    onChange={(e) => handleInteractiveReplacementChange(word.id, e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                    placeholder={`Enter a ${word.partOfSpeech}...`}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={generateInteractiveStory}
            >
              <FileText className="w-4 h-4" />
              Generate Silly Story
            </button>
          </div>
        )}

        {/* Static Mode Template */}
        {gameState === 'completed' && mode === 'static' && staticTemplate && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{storyTitle}</h2>
              <div className="flex gap-3">
                <button
                  onClick={downloadPDF}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </button>
                <button
                  onClick={resetGame}
                  className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  New Template
                </button>
              </div>
            </div>
            
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
                ref={storyRef}
                className="bg-yellow-50 p-4 rounded-xl border border-yellow-200"
              >
                <h4 className="font-semibold text-yellow-800 mb-3">Story Template:</h4>
                <p className="text-gray-800 leading-relaxed">
                  {staticTemplate}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Chatbot Interface */}
        {gameState === 'playing' && mode === 'chatbot' && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-6">
            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'bot' 
                      ? 'bg-purple-100 text-purple-600' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {message.sender === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.sender === 'bot'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your word here..."
                  className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                />
                <button
                  onClick={handleUserResponse}
                  disabled={!userResponse.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Completed Story */}
        {gameState === 'completed' && completedStory && mode !== 'static' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{storyTitle}</h2>
              <div className="flex gap-3">
                <button
                  onClick={downloadPDF}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </button>
                <button
                  onClick={shareStory}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button
                  onClick={resetGame}
                  className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  New Game
                </button>
              </div>
            </div>
            <div 
              ref={storyRef}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border-2 border-yellow-200"
            >
              <p className="text-lg leading-relaxed text-gray-800 font-medium">
                {completedStory}
              </p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-700 mb-3">How to play:</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Write or paste a complete story in the text area</li>
            <li>Choose your preferred mode:</li>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-sm">
              <li><strong>Interactive:</strong> Fill in words through the website interface</li>
              <li><strong>Static:</strong> Get a traditional MadLibs-style template with numbered blanks</li>
              <li><strong>Chatbot:</strong> Interactive conversation with AI guidance</li>
            </ul>
            <li>Let AI analyze your text and identify words to replace</li>
            <li>Provide silly replacement words or use the template offline</li>
            <li>Download your creation or share it with friends</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default App;