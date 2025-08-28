import nlp from 'compromise';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { WordToReplace } from '../components/InteractiveModeForm';

export function analyzeStory(text: string): WordToReplace[] {
  const allPotentialWords: WordToReplace[] = [];
  
  // Regex to match words (including hyphens/apostrophes) or common punctuation marks
  // This ensures we capture the exact string from the original text.
  const wordRegex = /(\b[a-zA-Z'-]+\b|[.,!?;:"'()])/g;
  let match;

  while ((match = wordRegex.exec(text)) !== null) {
    const fullMatch = match[0]; // This is the exact substring from the original text (e.g., "creatures,")
    const wordStart = match.index; // This is the exact start position in the original text

    // If the match is just punctuation, skip it for replacement purposes
    if (fullMatch.match(/^[.,!?;:"'()]$/)) {
      continue;
    }

    // Clean the word for NLP analysis (e.g., "creatures" from "creatures,")
    const cleanWord = fullMatch.replace(/[^\w]/g, '');
    
    // Skip very short words or words that are mostly punctuation after cleaning
    if (cleanWord.length < 3) {
      continue;
    }

    // Analyze the cleaned word with compromise
    const wordDoc = nlp(cleanWord);
    const wordData = wordDoc.json()[0];

    if (!wordData || !wordData.terms || wordData.terms.length === 0) {
      continue;
    }

    const term = wordData.terms[0];
    let partOfSpeech = '';
    let tense: string | undefined;

    if (term.tags) {
      if (term.tags.includes('Noun') || term.tags.includes('ProperNoun')) {
        partOfSpeech = 'noun';
      } else if (term.tags.includes('Adverb')) {
        partOfSpeech = 'adverb';
      } else if (term.tags.includes('Adjective')) {
        partOfSpeech = 'adjective';
      } else if (term.tags.includes('Verb')) {
        partOfSpeech = 'verb';
        if (term.tags.includes('PastTense')) {
          tense = 'past tense';
        } else if (term.tags.includes('PresentTense')) {
          tense = 'present tense';
        } else if (term.tags.includes('FutureTense')) {
          tense = 'future';
        } else if (term.tags.includes('Gerund')) {
          tense = 'ending in -ing';
        } else if (term.tags.includes('Infinitive')) {
          tense = 'infinitive';
        } else {
          tense = 'present tense';
        }
      }
    }

    // Only include specified parts of speech for replacement
    if (['noun', 'adjective', 'verb', 'adverb'].includes(partOfSpeech)) {
      allPotentialWords.push({
        id: `${partOfSpeech}-${wordStart}`, // Use position for a unique ID
        original: fullMatch, // Store the exact original substring matched by regex
        partOfSpeech,
        tense,
        index: allPotentialWords.length, // Keep a running index for selection
        position: wordStart
      });
    }
  }
  
  // Calculate total words for targetWordsToReplace based on the actual words found
  const totalWords = allPotentialWords.length;
  // We'll select ~25% (1/4) of the words, with a max of 25, to make the game more active.
  const targetWordsToReplace = Math.min(25, Math.max(1, Math.floor(totalWords / 4)));

  // Remove duplicates based on position and original text
  const uniqueWords = allPotentialWords.filter((word, index, array) => 
    array.findIndex(w => w.position === word.position && w.original === word.original) === index
  );
  
  // --- New selection logic to ensure variety ---
  const wordsByType = uniqueWords.reduce((acc, word) => {
    const type = word.partOfSpeech;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(word);
    return acc;
  }, {} as Record<string, WordToReplace[]>);

  // Shuffle each group of words
  for (const type in wordsByType) {
    wordsByType[type] = wordsByType[type].sort(() => Math.random() - 0.5);
  }

  const selectedWords: WordToReplace[] = [];
  const types = Object.keys(wordsByType);
  let typeIndex = 0;

  // Pick one word from each type cyclically until we reach the target
  while (selectedWords.length < targetWordsToReplace && selectedWords.length < uniqueWords.length) {
    const currentType = types[typeIndex % types.length];
    const word = wordsByType[currentType]?.shift(); // Take the first (randomized) word
    if (word) {
      selectedWords.push(word);
    }
    typeIndex++;
  }

  return selectedWords.sort((a, b) => a.position - b.position);
}

export function buildCompletedStory(
  originalStory: string,
  wordsToReplace: WordToReplace[],
  replacements: { [key: string]: string }
): string {
  const newStoryParts: string[] = [];
  let currentIndex = 0;

  // Sort words by position in ascending order to build the new string sequentially.
  const sortedWords = [...wordsToReplace].sort((a, b) => a.position - b.position);

  // This robust approach builds the new story from pieces, avoiding errors
  // from modifying the string while iterating over it. It also gracefully
  // handles any potential overlapping matches from the analysis step.
  sortedWords.forEach(word => {
    const replacement = replacements[word.id];

    // Ensure we don't process a word that overlaps with a previous one that has already been processed.
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

  return newStoryParts.join('');
}

export function generateStoryTemplate(originalText: string, words: WordToReplace[]): string {
  const newStoryParts: string[] = [];
  let currentIndex = 0;

  // The 'words' array is already sorted by position from analyzeStory.
  // We iterate through it to build the new template string piece by piece.
  // This avoids issues with in-place string modification and overlapping words.
  words.forEach((word, index) => {
    // Ensure we don't process a word that overlaps with a previous one.
    if (word.position >= currentIndex) {
      // Add the text from the last index up to the current word's position
      newStoryParts.push(originalText.substring(currentIndex, word.position));

      // Add the placeholder, using the loop index for numbering.
      const placeholder = `_____${index + 1}_____`;
      newStoryParts.push(placeholder);
      
      // Update the current index to be after the original word that was replaced.
      currentIndex = word.position + word.original.length;
    }
  });

  // Add any remaining part of the story after the last replacement.
  if (currentIndex < originalText.length) {
    newStoryParts.push(originalText.substring(currentIndex));
  }

  return newStoryParts.join('');
}

export async function downloadPDF(content: string, title: string, element: HTMLElement | null) {
  try {
    if (element) {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#F9C74F'
      });
      
      const imgData = canvas.getDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    } else {
      // Fallback for text-only PDF
      const pdf = new jsPDF();
      const splitText = pdf.splitTextToSize(content, 180);
      pdf.text(splitText, 10, 10);
      pdf.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(content);
    alert('PDF generation failed, but your story has been copied to clipboard!');
  }
}

export function shareStory(story: string) {
  if (navigator.share) {
    navigator.share({
      title: 'My Silly Story',
      text: story,
    }).catch(console.error);
  } else {
    navigator.clipboard.writeText(story);
    alert('Story copied to clipboard!');
  }
}