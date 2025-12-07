export const motivationalQuotes = [
  "Don't break the chain! Complete your tasks today.",
  "Small steps lead to big changes. Start now!",
  "Your future self will thank you for the work you do today.",
  "Consistency is the key to success. Keep going!",
  "Every task completed is a step closer to your goal.",
  "The secret of getting ahead is getting started.",
  "Success is the sum of small efforts repeated day in and day out.",
  "You don't have to be great to start, but you have to start to be great.",
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "Don't watch the clock; do what it does. Keep going.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Dream bigger. Do bigger.",
  "Don't stop when you're tired. Stop when you're done.",
  "Wake up with determination. Go to bed with satisfaction.",
]

export const congratulatoryMessages = [
  "Amazing work! All tasks completed! 🎉",
  "You're on fire! Keep up the great work! 🔥",
  "Perfect day! You're unstoppable! ⭐",
  "Crushing it! All tasks done! 💪",
  "Fantastic! You've completed everything! 🌟",
  "Brilliant! Another productive day! ✨",
  "Outstanding! You're making great progress! 🚀",
]

export function getRandomQuote() {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
}

export function getRandomCongratulation() {
  return congratulatoryMessages[Math.floor(Math.random() * congratulatoryMessages.length)]
}
