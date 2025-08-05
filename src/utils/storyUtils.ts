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
  
  // Get the full document JSON to access precise positions
  const docJson = doc.json();
  
  // Process each sentence to get precise word positions
  docJson.forEach((sentence: any, sentenceIndex: number) => {
    if (!sentence.terms) return;
    
    sentence.terms.forEach((term: any, termIndex: number) => {
      // Skip very short words, punctuation, and common words
      if (!term.text || term.text.length < 2 || /^[^\w]/.test(term.text)) return;
      
      const originalText = term.text;
      const position = term.offset || 0;
      
      // Determine part of speech and tense
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
          return;
        }
      }
      
      // Only include nouns, adjectives, and verbs
      if (['noun', 'adjective', 'verb'].includes(partOfSpeech)) {
        allPotentialWords.push({
          id: `${partOfSpeech}-${sentenceIndex}-${termIndex}-${position}`,
          original: originalText,
          partOfSpeech,
          tense,
          index: termIndex,
          position
        });
      }
    });
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
  let template = originalText;
  const sortedWords = [...words].sort((a, b) => b.position - a.position);
  
  sortedWords.forEach((word, index) => {
    const placeholder = `_____${index + 1}_____`;
    template = template.substring(0, word.position) + placeholder + template.substring(word.position + word.original.length);
  });
  
  return template;
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