// routes

const express = require("express");
const router = express.Router();

const {feedbackStore} = require("../data/feedback.data");
const {analyzeSentiment, detectThemes, countThemes} = require("../services/service");

// POST feedback
router.post("/", (req, res) => {
  const { productId, rating, review } = req.body;

  if (!productId || !rating || !review) {
    return res.status(400).json({
      error: "productId, rating and review are required"
    });
  }

  const sentiment = analyzeSentiment(review);
  const themes = detectThemes(review);

  const feedback = {
    productId,
    rating,
    review,
    sentiment,
    themes
  };

  feedbackStore.push(feedback);

  res.json({
    message: "Feedback saved successfully",
    data: feedback
  });
});

//GET API for product feedback
router.get("/:productId", (req, res) => {
  const productId = req.params.productId;

  const productFeedback = feedbackStore.filter(
    item => item.productId === productId
  );

  const themeSummary = countThemes(productFeedback);

  res.json({
    productId,
    count: productFeedback.length,
    themes: themeSummary,
    feedback: productFeedback
  });
});


//dashboard api
router.get("/dashboard/:productId", (req, res) => {
  const productId = req.params.productId;

  const productFeedback = feedbackStore.filter(
    item => item.productId === productId
  );

  let positive = 0;
  let negative = 0;
  let neutral = 0;

  productFeedback.forEach(item => {
    if (item.sentiment === "positive") positive++;
    else if (item.sentiment === "negative") negative++;
    else neutral++;
  });


  const themeSummary = countThemes(productFeedback);

  res.json({
    productId,
    sentiment: {
      positive,
      negative,
      neutral
    },
    themes: themeSummary
  });
});


module.exports = router;
