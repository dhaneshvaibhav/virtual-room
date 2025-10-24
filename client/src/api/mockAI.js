// client/src/api/mockAI.js
import { conversationSeeds } from './seedConversations';

const friendlyReplies = [
  "Keep it simple — one small step at a time.",
  "Short and sweet: focus for 15 minutes, you got this.",
  "Tiny goals win. What's one easy thing you can do now?",
  "Cute and quick: breathe, then try the next tiny task."
];

const seedsMap = new Map(
  conversationSeeds.map(s => [s.prompt.trim().toLowerCase(), s.reply])
);

function capitalize(name) {
  if (!name) return '';
  return name.split(' ').map(w => w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : '').join(' ').trim();
}

function tryMath(str) {
  const m = (str || '').replace(/×/g, 'x').toLowerCase().match(/(-?\d+(?:\.\d+)?)\s*([+\-x*/])\s*(-?\d+(?:\.\d+)?)/);
  if (!m) return null;
  const a = parseFloat(m[1]);
  const op = m[2];
  const b = parseFloat(m[3]);
  let result;
  switch (op) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case 'x':
    case '*': result = a * b; break;
    case '/': result = b === 0 ? '∞' : a / b; break;
    default: return null;
  }
  // return integer if exact, else trimmed decimal
  return Number.isInteger(result) ? String(result) : String(parseFloat(result.toFixed(4)));
}

function tryGreeting(str) {
  if (!str) return null;
  const low = str.trim().toLowerCase();
  return /^(hi|hello|hey|yo|hola|howdy|sup|hai|hi there|greetings|good day)\b/.test(low) ? 'hlo' : null;
}

function tryName(str) {
  if (!str) return null;
  const m = str.match(/(?:my name is|i am|call me)\s+([a-zA-Z][a-zA-Z ]{0,40})/i);
  if (!m) return null;
  return `Nice to meet you, ${capitalize(m[1])}!`;
}

export async function getChatbotReply(prompt) {
  const low = (prompt || '').trim().toLowerCase();
  if (!low) return friendlyReplies[Math.floor(Math.random() * friendlyReplies.length)];

  // Exact seed match
  if (seedsMap.has(low)) return seedsMap.get(low);

  // Heuristics: math, greetings, names
  const math = tryMath(low);
  if (math !== null) return math;
  const greet = tryGreeting(low);
  if (greet !== null) return greet;
  const nameReply = tryName(prompt);
  if (nameReply !== null) return nameReply;

  // Lightweight defaults for short cute replies
  if (low.includes('quiz') || low.includes('test')) {
    return "Quick 3 Qs ready — type 'ready' to start.";
  }
  if (low.includes('break') || low.includes('rest')) {
    return "Take a tiny 5-min break — stretch and smile.";
  }

  return friendlyReplies[Math.floor(Math.random() * friendlyReplies.length)];
}
