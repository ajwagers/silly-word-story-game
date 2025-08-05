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
  
  // Find nouns
  doc.nouns().forEach((noun, index) => {
    const nounText = noun.text();
    let searchStart = 0;
    let position = text.indexOf(nounText, searchStart);
    
    while (position !== -1) {
      allPotentialWords.push({
        id: `noun-${index}`,
        original: nounText,
        partOfSpeech: 'noun',
        index,
        position
      });
      searchStart = position + 1;
      position = text.indexOf(nounText, searchStart);
    }
  });
  
  // Find adjectives
  doc.adjectives().forEach((adj, index) => {
    const adjText = adj.text();
    let searchStart = 0;
    let position = text.indexOf(adjText, searchStart);
    
    while (position !== -1) {
      allPotentialWords.push({
        id: `adjective-${index}`,
        original: adjText,
        partOfSpeech: 'adjective',
        index,
        position
      });
      searchStart = position + 1;
      position = text.indexOf(adjText, searchStart);
    }
  });
  
  // Find verbs
  doc.verbs().forEach((verb, index) => {
    const verbText = verb.text();
    let searchStart = 0;
    let position = text.indexOf(verbText, searchStart);
    
    // Determine verb tense
    const verbJson = verb.json()[0];
    let tense = 'present'; // default
    
    if (verbJson && verbJson.terms && verbJson.terms[0]) {
      const term = verbJson.terms[0];
      if (term.tags && term.tags.includes('PastTense')) {
        tense = 'past';
      } else if (term.tags && term.tags.includes('PresentTense')) {
        tense = 'present';
      } else if (term.tags && term.tags.includes('FutureTense')) {
        tense = 'future';
      } else if (term.tags && term.tags.includes('Gerund')) {
        tense = 'present (ing form)';
      } else if (term.tags && term.tags.includes('Infinitive')) {
        tense = 'infinitive';
      }
    }
    
    while (position !== -1) {
      allPotentialWords.push({
        id: `verb-${index}`,
        original: verbText,
        partOfSpeech: 'verb',
        tense,
        index,
        position
      });
      searchStart = position + 1;
      position = text.indexOf(verbText, searchStart);
    }
  });
  
  // Remove duplicates based on position and original text
  const uniqueWords = allPotentialWords.filter((word, index, array) => 
    array.findIndex(w => w.position === word.position && w.original === word.original) === index
  );
  
  // Randomly select words to ensure they're scattered throughout the story
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