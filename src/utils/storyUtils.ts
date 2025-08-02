import nlp from 'compromise';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { WordToReplace } from '../components/InteractiveModeForm';

export function analyzeStory(text: string): WordToReplace[] {
  const doc = nlp(text);
  const words: WordToReplace[] = [];
  
  // Find nouns
  doc.nouns().forEach((noun, index) => {
    const nounText = noun.text();
    const position = text.indexOf(nounText);
    if (position !== -1) {
      words.push({
        id: `noun-${index}`,
        original: nounText,
        partOfSpeech: 'noun',
        index,
        position
      });
    }
  });
  
  // Find adjectives
  doc.adjectives().forEach((adj, index) => {
    const adjText = adj.text();
    const position = text.indexOf(adjText);
    if (position !== -1) {
      words.push({
        id: `adjective-${index}`,
        original: adjText,
        partOfSpeech: 'adjective',
        index,
        position
      });
    }
  });
  
  // Find verbs
  doc.verbs().forEach((verb, index) => {
    const verbText = verb.text();
    const position = text.indexOf(verbText);
    if (position !== -1) {
      words.push({
        id: `verb-${index}`,
        original: verbText,
        partOfSpeech: 'verb',
        index,
        position
      });
    }
  });
  
  // Sort by position in text and limit to 8 words for better mobile experience
  return words.sort((a, b) => a.position - b.position).slice(0, 8);
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