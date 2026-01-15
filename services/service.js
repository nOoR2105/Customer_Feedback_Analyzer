// logics

//defining positive words
const positiveWords = [
  "shiny",
  "elegant",
  "premium",
  "beautiful",
  "comfortable",
  "nice",
  "good",
  "strong"
];

//defining negative words
const negativeWords = [
  "dull",
  "broke",
  "heavy",
  "tarnish",
  "bad",
  "uncomfortable",
  "fragile"
];

//defining themes
const themes = {
  comfort: ["light", "heavy", "fit", "comfortable", "wearable", "uncomfortable"],
  durability: ["broke", "strong", "quality", "fragile", "soft"],
  appearance: ["shiny", "dull", "design", "polish", "elegant", "beautiful", "pretty"]
};


//main logic

//for sentiment detection
function analyzeSentiment(review) {
  const text = review.toLowerCase();

  let positiveCount = 0;
  let negativeCount = 0;

  positiveWords.forEach(word => {
    if (text.includes(word)) positiveCount++;
  });

  negativeWords.forEach(word => {
    if (text.includes(word)) negativeCount++;
  });

  if (positiveCount > negativeCount) return "positive";
  if (negativeCount > positiveCount) return "negative";
  return "neutral";
}

//for theme detection
function detectThemes(review) {
  const text = review.toLowerCase();
  const detectedThemes = [];

  for (const theme in themes) {
    const keywords = themes[theme];

    for (const word of keywords) {
      if (text.includes(word)) {
        detectedThemes.push(theme);
        break; // avoid duplicate theme
      }
    }
  }

  return detectedThemes;
}

//for counting number of themes per product
function countThemes(feedbackList) {
  const themeCounts = {};

  feedbackList.forEach(feedback => {
    feedback.themes.forEach(theme => {
      themeCounts[theme] = (themeCounts[theme] || 0) + 1;
    });
  });

  return themeCounts;
}



module.exports = {
  analyzeSentiment,
  detectThemes,
  countThemes
};
