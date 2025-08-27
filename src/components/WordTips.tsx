import { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';

const tips = [
  {
    title: 'Adverbs',
    content: 'Adverbs describe verbs, adjectives, or other adverbs. They often end in "-ly" (like "quickly" or "slowly").',
    color: 'bg-blue-100',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-500',
  },
  {
    title: 'Proper Nouns',
    content: 'A proper noun is the specific name of a person, place, or organization. Always capitalize them! (e.g., "Samantha", "New York").',
    color: 'bg-green-100',
    textColor: 'text-green-800',
    iconColor: 'text-green-500',
  },
  {
    title: 'Verbs',
    content: 'Verbs are action words! They tell you what the subject of a sentence is doing (e.g., "run", "jump", "think").',
    color: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    iconColor: 'text-yellow-500',
  },
  {
    title: 'Nouns',
    content: 'A noun is a word for a person, place, thing, or idea (e.g., "cat", "house", "happiness").',
    color: 'bg-purple-100',
    textColor: 'text-purple-800',
    iconColor: 'text-purple-500',
  },
  {
    title: 'Adjectives',
    content: 'Adjectives are describing words. They tell you more about a noun (e.g., "happy" dog, "tall" building).',
    color: 'bg-pink-100',
    textColor: 'text-pink-800',
    iconColor: 'text-pink-500',
  },
];

const WordTips = () => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
        setIsFading(false);
      }, 500); // Match this with the fade-out duration
    }, 7000); // Change tip every 7 seconds

    return () => clearInterval(interval);
  }, []);

  const currentTip = tips[currentTipIndex];

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className={`${currentTip.color} rounded-xl shadow-lg p-6 border border-gray-200 transition-colors duration-500 ease-in-out`}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 pt-1">
            <Lightbulb className={`w-8 h-8 ${currentTip.iconColor} transition-colors duration-500 ease-in-out`} />
          </div>
          <div 
            className={`transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}
          >
            <h3 className={`text-xl font-bold ${currentTip.textColor}`}>Word Tip: {currentTip.title}</h3>
            <p className={`mt-1 text-base ${currentTip.textColor}`}>{currentTip.content}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WordTips;