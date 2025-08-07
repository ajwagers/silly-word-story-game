import nlp from 'compromise';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { WordToReplace } from '../components/InteractiveModeForm';

export function analyzeStory(text: string): WordToReplace[] {
  const doc = nlp(text);
  
  // Calculate total words and target number of words to replace
  const totalWords = text.split(/\s+/).filter(word => word.length > 0).length;
  const targetWordsToReplace = Math.min(20, Math.max(1, Math.floor(totalWords / 8)));
  
  const allPotentialWords: WordToReplace[] = [];
  
  // Find words using a more reliable approach
  const words = text.split(/\s+/);
  let currentPosition = 0;
  
  words.forEach((word, wordIndex) => {
    // Find the actual position of this word in the original text
    const wordStart = text.indexOf(word, currentPosition);
    if (wordStart === -1) {
      currentPosition += word.length + 1; // +1 for space
      return;
    }
    
    // Clean the word of punctuation for analysis
    const cleanWord = word.replace(/[^\w]/g, '');
    
    // Skip very short words or words that are mostly punctuation
    if (cleanWord.length < 3) {
      currentPosition = wordStart + word.length;
      return;
    }
    
    // Analyze the clean word with compromise
    const wordDoc = nlp(cleanWord);
    const wordData = wordDoc.json()[0];
    
    if (!wordData || !wordData.terms || wordData.terms.length === 0) {
      currentPosition = wordStart + word.length;
      return;
    }
    
    const term = wordData.terms[0];
    let partOfSpeech = 'noun'; // default
    let tense: string | undefined;
    
    if (term.tags) {
      if (term.tags.includes('Noun') || term.tags.includes('ProperNoun')) {
        partOfSpeech = 'noun';
      } else if (term.tags.includes('Adjective')) {
        partOfSpeech = 'adjective';
      } else if (term.tags.includes('Verb')) {
        partOfSpeech = 'verb';
        
        // Determine verb tense
        if (term.tags.includes('PastTense')) {
          tense = 'past';
        } else if (term.tags.includes('PresentTense')) {
          tense = 'present';
        } else if (term.tags.includes('FutureTense')) {
          tense = 'future';
        } else if (term.tags.includes('Gerund')) {
          tense = 'present (ing form)';
        } else if (term.tags.includes('Infinitive')) {
          tense = 'infinitive';
        } else {
          tense = 'present'; // default for verbs
        }
      } else {
        // Skip words that aren't nouns, adjectives, or verbs
        currentPosition = wordStart + word.length;
        return;
      }
    }
    
    // Only include nouns, adjectives, and verbs
    if (['noun', 'adjective', 'verb'].includes(partOfSpeech)) {
      allPotentialWords.push({
        id: `${partOfSpeech}-${wordIndex}-${wordStart}`,
        original: cleanWord,
        partOfSpeech,
        tense,
        index: wordIndex,
        position: wordStart
      });
    }
    
    currentPosition = wordStart + word.length;
  });
  
  // Remove duplicates based on position and original text
  const uniqueWords = allPotentialWords.filter((word, index, array) => 
    array.findIndex(w => w.position === word.position && w.original === word.original) === index
  );
  
  // Randomly select target number of words to ensure they're scattered throughout the story
  const shuffledWords = [...uniqueWords].sort(() => Math.random() - 0.5);
  const selectedWords = shuffledWords.slice(0, targetWordsToReplace);
  
  // Sort selected words by position in text for proper replacement order
  return selectedWords.sort((a, b) => a.position - b.position);
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