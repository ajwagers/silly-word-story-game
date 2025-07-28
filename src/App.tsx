import React, { useState, useRef, useEffect } from 'react';
import { Download, Share2, RefreshCw, FileText, Send, Bot, User } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import nlp from 'compromise';
import InteractiveModeForm, { WordToReplace } from './components/InteractiveModeForm';
import Chatbot, { ChatMessage } from './components/Chatbot';
import CompletedStory, { DisplayMode } from './components/CompletedStory';

interface StoryData {
  title: string;
  wordsToReplace: WordToReplace[];
}

enum GameMode {
  Interactive = 'interactive',
  Static = 'static',
  Chatbot = 'chatbot',
}

enum GameState {
  Setup = 'setup',
  Playing = 'playing',
  Completed = 'completed',
}

function App() {
  const [inputText, setInputText] = useState('The quick brown fox jumps over the lazy dog. The beautiful princess danced gracefully in the moonlight while the brave knight fought the terrible dragon.');
  const [mode, setMode] = useState<GameMode>(GameMode.Interactive);
  const [wordsToReplace, setWordsToReplace] = useState<WordToReplace[]>([]);
  const [storyTitle, setStoryTitle] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [completedStory, setCompletedStory] = useState('');
  const [staticTemplate, setStaticTemplate] = useState('');
  const [gameState, setGameState] = useState<GameState>(GameState.Setup);
  const [interactiveReplacements, setInteractiveReplacements] = useState<{[key: string]: string}>({});
  const storyRef = useRef<HTMLDivElement>(null);

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
    setGameState(GameState.Playing);
    
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
    let result = inputText; 
    // Sort words by position to replace from the end, avoiding index shifts
    const sortedWords = [...wordsToReplace].sort((a, b) => b.position - a.position);

    sortedWords.forEach(word => {
      const replacement = interactiveReplacements[word.id];
      if (replacement?.trim()) {
        // Use position to replace the exact word, preventing issues with duplicate words
        result = result.substring(0, word.position) + replacement + result.substring(word.position + word.original.length);
      }
    });

    setCompletedStory(result);
    setGameState(GameState.Completed);
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
    setGameState(GameState.Completed);
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
    // Sort words by position to replace from the end, avoiding index shifts
    const sortedWords = [...words].sort((a, b) => b.position - a.position);
    
    sortedWords.forEach(word => {
      if (word.replacement?.trim()) {
        // Use position to replace the exact word, preventing issues with duplicate words
        result = result.substring(0, word.position) + word.replacement + result.substring(word.position + word.original.length);
      }
    });

    setCompletedStory(result);
    setGameState(GameState.Completed);

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
    // Sort words by position to replace from the end, avoiding index shifts
    const sortedWords = [...wordsToReplace].sort((a, b) => b.position - a.position);

    sortedWords.forEach((word) => {
      const indexInOriginalList = wordsToReplace.findIndex(w => w.id === word.id);
      storyWithBlanks = storyWithBlanks.substring(0, word.position) + `(${indexInOriginalList + 1}) ___________` + storyWithBlanks.substring(word.position + word.original.length);
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
    setGameState(GameState.Setup);
  };

  return (
    <div className="min-h-screen p-4" style={{backgroundColor: '#E9C46A'}}>
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <FileText className="w-12 h-12" style={{color: '#264653'}} />
            </div>
            <h1 className="text-5xl font-black" style={{color: '#264653'}}>
              Silly Word Story Game
            </h1>
            <div className="relative">
              <div className="text-4xl">🎭</div>
            </div>
          </div>
          <p className="text-xl font-bold px-6 py-3 rounded-full border-4 shadow-lg" style={{color: '#264653', backgroundColor: '#F9C74F', borderColor: '#2A9D8F'}}>
            🌟 Let AI find words in your story and replace them with SUPER SILLY alternatives! 🌟
          </p>
        </div>

        {/* Mode Selection */}
        {gameState === GameState.Setup && (
          <div className="rounded-3xl shadow-2xl p-8 mb-6 border-4" style={{backgroundColor: '#F9C74F', borderColor: '#2A9D8F'}}>
            <h3 className="text-2xl font-black mb-6 text-center" style={{color: '#264653'}}>🎮 Choose Your Adventure Mode! 🎮</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setMode(GameMode.Interactive)}
                className={`flex-1 p-6 rounded-2xl border-4 ${
                  mode === GameMode.Interactive
                    ? 'shadow-xl'
                    : 'hover:shadow-lg'
                }`}
                style={{
                  backgroundColor: mode === GameMode.Interactive ? '#2A9D8F' : '#F4A261',
                  borderColor: mode === GameMode.Interactive ? '#264653' : '#2A9D8F',
                  color: mode === GameMode.Interactive ? 'white' : '#264653'
                }}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <h4 className="font-black mb-3 text-lg">Interactive Mode</h4>
                  <p className="text-sm font-semibold">Fill in all words at once, then generate your story!</p>
                </div>
              </button>
              <button
                onClick={() => setMode(GameMode.Static)}
                className={`flex-1 p-6 rounded-2xl border-4 ${
                  mode === GameMode.Static
                    ? 'shadow-xl'
                    : 'hover:shadow-lg'
                }`}
                style={{
                  backgroundColor: mode === GameMode.Static ? '#2A9D8F' : '#F4A261',
                  borderColor: mode === GameMode.Static ? '#264653' : '#2A9D8F',
                  color: mode === GameMode.Static ? 'white' : '#264653'
                }}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">📝</div>
                  <h4 className="font-black mb-3 text-lg">Static Mode</h4>
                  <p className="text-sm font-semibold">Get a word list and template to fill in later!</p>
                </div>
              </button>
              <button
                onClick={() => setMode(GameMode.Chatbot)}
                className={`flex-1 p-6 rounded-2xl border-4 ${
                  mode === GameMode.Chatbot
                    ? 'shadow-xl'
                    : 'hover:shadow-lg'
                }`}
                style={{
                  backgroundColor: mode === GameMode.Chatbot ? '#2A9D8F' : '#F4A261',
                  borderColor: mode === GameMode.Chatbot ? '#264653' : '#2A9D8F',
                  color: mode === GameMode.Chatbot ? 'white' : '#264653'
                }}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🤖</div>
                  <h4 className="font-black mb-3 text-lg">Chatbot Mode</h4>
                  <p className="text-sm font-semibold">Chat with AI for super fun guidance!</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Setup Phase */}
        {gameState === GameState.Setup && (
          <div className="rounded-3xl shadow-2xl p-8 mb-6 border-4" style={{backgroundColor: '#F4A261', borderColor: '#2A9D8F'}}>
            <label className="block text-2xl font-black mb-4 text-center" style={{color: '#264653'}}>
              ✨ Enter Your Amazing Story Here! ✨
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-40 p-6 border-4 rounded-2xl resize-none text-lg font-semibold shadow-inner"
              style={{backgroundColor: '#F9C74F', borderColor: '#2A9D8F', color: '#264653'}}
              placeholder="🌈 Write your amazing story here! I'll find the perfect words to make it SUPER SILLY! 🌈"
            />
            
            {mode === GameMode.Interactive ? (
              <button
                onClick={() => {
                  const storyData = analyzeTextForReplacements(inputText);
                  setWordsToReplace(storyData.wordsToReplace);
                  setStoryTitle(storyData.title);
                  setGameState(GameState.Playing);
                }}
                disabled={!inputText.trim()}
                className="mt-6 flex items-center gap-3 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed border-4"
                style={{backgroundColor: '#2A9D8F', borderColor: '#264653'}}
              >
                <FileText className="w-6 h-6" />
                🔍 Analyze My Story!
              </button>            
            ) : mode === GameMode.Static ? (
              <button
                onClick={generateStaticTemplate}
                disabled={!inputText.trim()}
                className="mt-6 flex items-center gap-3 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed border-4"
                style={{backgroundColor: '#2A9D8F', borderColor: '#264653'}}
              >
                <FileText className="w-6 h-6" />
                📋 Make My Template!
              </button>
            ) : (
              <button
                onClick={startChatbotGame}
                disabled={!inputText.trim()}
                className="mt-6 flex items-center gap-3 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed border-4"
                style={{backgroundColor: '#2A9D8F', borderColor: '#264653'}}
              >
                <Bot className="w-6 h-6" />
                🤖 Start Chatbot Fun!
              </button>
            )}
          </div>
        )}

        {/* Interactive Mode Form */}
        {gameState === GameState.Playing && mode === GameMode.Interactive && wordsToReplace.length > 0 && (
          <InteractiveModeForm
            storyTitle={storyTitle}
            wordsToReplace={wordsToReplace}
            interactiveReplacements={interactiveReplacements}
            onReplacementChange={handleInteractiveReplacementChange}
            onGenerateStory={generateInteractiveStory}
          />
        )}

        {/* Static Mode Template */}
        {gameState === GameState.Completed && mode === GameMode.Static && staticTemplate && (
          <CompletedStory
            ref={storyRef}
            storyTitle={storyTitle}
            staticTemplate={staticTemplate}
            wordsToReplace={wordsToReplace}
            displayMode={DisplayMode.Template}
            onDownloadPDF={downloadPDF}
            onShareStory={shareStory}
            onReset={resetGame}
          />
        )}

        {/* Chatbot Interface */}
        {gameState === GameState.Playing && mode === GameMode.Chatbot && (
          <Chatbot
            chatMessages={chatMessages}
            userResponse={userResponse}
            setUserResponse={setUserResponse}
            onSendMessage={handleUserResponse}
          />
        )}

        {/* Completed Story */}
        {gameState === GameState.Completed && completedStory && mode !== GameMode.Static && (
          <CompletedStory
            ref={storyRef}
            storyTitle={storyTitle}
            completedStory={completedStory}
            wordsToReplace={wordsToReplace}
            displayMode={DisplayMode.Story}
            onDownloadPDF={downloadPDF}
            onShareStory={shareStory}
            onReset={resetGame}
          />
        )}

        {/* Instructions */}
        <div className="rounded-3xl p-8 border-4 shadow-2xl" style={{backgroundColor: '#F4A261', borderColor: '#2A9D8F'}}>
          <h4 className="text-2xl font-black mb-6 text-center" style={{color: '#264653'}}>🎯 How to Play This AWESOME Game! 🎯</h4>
          <ol className="list-none space-y-4 font-bold text-lg" style={{color: '#264653'}}>
            <li className="flex items-center gap-3 p-4 rounded-2xl border-2" style={{backgroundColor: '#F9C74F', borderColor: '#2A9D8F'}}>
              <span className="text-white w-8 h-8 rounded-full flex items-center justify-center font-black" style={{backgroundColor: '#2A9D8F'}}>1</span>
              Write or paste a complete story in the text area 📝
            </li>
            <li className="flex items-center gap-3 p-4 rounded-2xl border-2" style={{backgroundColor: '#F9C74F', borderColor: '#2A9D8F'}}>
              <span className="text-white w-8 h-8 rounded-full flex items-center justify-center font-black" style={{backgroundColor: '#2A9D8F'}}>2</span>
              Choose your preferred mode:
            </li>
            <ul className="list-none ml-12 space-y-2 text-base">
              <li className="flex items-center gap-2 p-3 rounded-xl border-2" style={{backgroundColor: '#E9C46A', borderColor: '#2A9D8F'}}>
                <span>🎯</span> <strong>Interactive:</strong> Fill in words through the website!
              </li>
              <li className="flex items-center gap-2 p-3 rounded-xl border-2" style={{backgroundColor: '#E9C46A', borderColor: '#2A9D8F'}}>
                <span>📝</span> <strong>Static:</strong> Get a template with numbered blanks!
              </li>
              <li className="flex items-center gap-2 p-3 rounded-xl border-2" style={{backgroundColor: '#E9C46A', borderColor: '#2A9D8F'}}>
                <span>🤖</span> <strong>Chatbot:</strong> Chat with AI for guidance!
              </li>
            </ul>
            <li className="flex items-center gap-3 p-4 rounded-2xl border-2" style={{backgroundColor: '#F9C74F', borderColor: '#2A9D8F'}}>
              <span className="text-white w-8 h-8 rounded-full flex items-center justify-center font-black" style={{backgroundColor: '#2A9D8F'}}>3</span>
              Let AI find the perfect words to replace! 🔍
            </li>
            <li className="flex items-center gap-3 p-4 rounded-2xl border-2" style={{backgroundColor: '#F9C74F', borderColor: '#2A9D8F'}}>
              <span className="text-white w-8 h-8 rounded-full flex items-center justify-center font-black" style={{backgroundColor: '#2A9D8F'}}>4</span>
              Add your SILLY replacement words! 🤪
            </li>
            <li className="flex items-center gap-3 p-4 rounded-2xl border-2" style={{backgroundColor: '#F9C74F', borderColor: '#2A9D8F'}}>
              <span className="text-white w-8 h-8 rounded-full flex items-center justify-center font-black" style={{backgroundColor: '#2A9D8F'}}>5</span>
              Download or share your hilarious creation! 🎉
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default App;