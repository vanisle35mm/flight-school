import type { Flashcard } from '../types';

const LIST_CUE = /\b(required|documents|types|examples|steps|includes?|components|parts|items|categories|classes|conditions|limitations|equipment|procedures|rules)\b/i;
const SECTION_HEADING = /^\d+(?:\.\d+)+\s+/;

const cleanLine = (value: string) => value
  .replace(/^[\s>*-]+/, '')
  .replace(/^\d+[.)]\s+/, '')
  .replace(/\s+/g, ' ')
  .trim();

const normalizeQuestion = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');
const withQuestionMark = (value: string) => `${value.replace(/[?.!]+$/, '')}?`;

const listQuestion = (heading: string) => {
  const cleanHeading = heading.replace(/[:.]$/, '').trim();
  const required = cleanHeading.match(/^required\s+(.+)$/i);
  if (required) {
    const subject = required[1].replace(/\s*\bonboard\b\s*/i, ' ').trim();
    const onboard = /\bonboard\b/i.test(required[1]);
    return withQuestionMark(`What ${subject} are required${onboard ? ' onboard' : ''}`);
  }
  if (/^(types|examples|steps|components|parts|items|categories|classes|conditions|limitations|equipment|procedures|rules)\b/i.test(cleanHeading)) {
    return withQuestionMark(`What are the ${cleanHeading.charAt(0).toLowerCase()}${cleanHeading.slice(1)}`);
  }
  return withQuestionMark(`What is included under ${cleanHeading}`);
};

const definitionQuestion = (subject: string, verb: string) => {
  const cleanSubject = subject.replace(/^(a|an|the)\s+/i, '').trim();
  if (/means|refers to/i.test(verb)) return withQuestionMark(`What does ${cleanSubject} mean`);
  return withQuestionMark(`What is ${cleanSubject}`);
};

export const generateFlashcardsFromNotes = (notes: string, topic: string): Flashcard[] => {
  const rawLines = notes.split(/\r?\n/);
  const lines = rawLines.map(cleanLine);
  const cards: Flashcard[] = [];
  const consumed = new Set<number>();
  const addCard = (question: string, answer: string) => {
    const cleanQuestion = withQuestionMark(question.trim());
    const cleanAnswer = answer.trim();
    if (!cleanQuestion || cleanQuestion === '?' || !cleanAnswer) return;
    if (cards.some((card) => normalizeQuestion(card.question) === normalizeQuestion(cleanQuestion))) return;
    cards.push({ question: cleanQuestion, answer: cleanAnswer });
  };

  for (let index = 0; index < lines.length; index += 1) {
    const questionMatch = lines[index].match(/^(?:q|question)\s*:\s*(.+)$/i);
    if (!questionMatch) continue;
    const inlineAnswer = questionMatch[1].match(/^(.+?)\s+(?:a|answer)\s*:\s*(.+)$/i);
    if (inlineAnswer) {
      addCard(inlineAnswer[1], inlineAnswer[2]);
      consumed.add(index);
      continue;
    }
    const nextAnswer = lines[index + 1]?.match(/^(?:a|answer)\s*:\s*(.+)$/i);
    if (nextAnswer) {
      addCard(questionMatch[1], nextAnswer[1]);
      consumed.add(index);
      consumed.add(index + 1);
    }
  }

  for (let index = 0; index < lines.length; index += 1) {
    const heading = lines[index];
    if (consumed.has(index) || !heading || !LIST_CUE.test(heading) || SECTION_HEADING.test(heading) || heading.length > 90) continue;
    const items: string[] = [];
    let nextIndex = index + 1;
    while (nextIndex < lines.length && items.length < 10) {
      const item = lines[nextIndex];
      if (!item || SECTION_HEADING.test(item) || (LIST_CUE.test(item) && items.length > 0) || item.length > 110 || /[.!?]$/.test(item)) break;
      items.push(item);
      nextIndex += 1;
    }
    if (items.length < 2) continue;
    addCard(listQuestion(heading), items.join('; '));
    consumed.add(index);
    for (let itemIndex = index + 1; itemIndex < nextIndex; itemIndex += 1) consumed.add(itemIndex);
  }

  lines.forEach((line, index) => {
    if (consumed.has(index) || !line || SECTION_HEADING.test(line)) return;
    const colonPair = line.match(/^([^:]{2,70}):\s*(.{3,})$/);
    if (colonPair && !/^(?:q|question|a|answer)$/i.test(colonPair[1])) {
      addCard(`What is ${colonPair[1].trim()}`, colonPair[2]);
      consumed.add(index);
      return;
    }
    const dashPair = line.match(/^(.{2,65})\s+-\s+(.{3,})$/);
    if (dashPair) {
      addCard(`What is ${dashPair[1].trim()}`, dashPair[2]);
      consumed.add(index);
      return;
    }
    const definition = line.match(/^(.{2,65}?)\s+(is|are|means|refers to)\s+(.{3,})$/i);
    if (definition) {
      addCard(definitionQuestion(definition[1], definition[2]), line);
      consumed.add(index);
    }
  });

  lines.forEach((line, index) => {
    if (cards.length >= 20 || consumed.has(index) || !line || SECTION_HEADING.test(line) || line.length < 24) return;
    const focus = line.split(/[,;:(]/)[0].replace(/[.!?]$/, '').trim().slice(0, 64);
    if (focus.length < 4) return;
    addCard(`What should you remember about ${focus.charAt(0).toLowerCase()}${focus.slice(1)}`, line);
  });

  if (!cards.length && notes.trim()) {
    addCard(`What are the main points from ${topic.trim() || 'this lesson'}`, notes.trim().slice(0, 1200));
  }

  return cards.slice(0, 20);
};
