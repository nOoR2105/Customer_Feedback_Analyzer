// Store rating

let selectedRating = null;
let sentimentChart = null;
//let lastSelectedProduct = null;
let lastSelectedProduct = "ring_1"; 
let lastDashboardData = null;


// handle rating button 
document.querySelectorAll(".rating-btn").forEach(btn => {
  btn.onclick = () => {
    selectedRating = btn.dataset.value;

    document.querySelectorAll(".rating-btn").forEach(b =>
      b.classList.remove("active")
    );

    btn.classList.add("active");
  };
});

// handle feedback submission
document.getElementById("submit").onclick = () => {
  const productId = document.getElementById("product").value;
  const review = document.getElementById("review").value;
  const status = document.getElementById("status");

  // Validation logic
  if (!productId) {
    status.textContent = "Please select a product.";
    status.style.color = "red";
    return;
  }
  if (!selectedRating) {
    status.textContent = "Please select a rating.";
    status.style.color = "red";
    return;
  }
  if (!review) {
    status.textContent = "Please write a review.";
    status.style.color = "red";
    return;
  }

  //feedback 
  fetch("http://localhost:3000/feedback", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      productId,
      rating: Number(selectedRating),
      review
    })
  })
    .then(res => res.json())
    .then(() => {
      status.textContent = "Feedback submitted successfully.";
      status.style.color = "green";

      lastSelectedProduct = productId;

      document.getElementById("dashboardProduct").value = productId;
      updateDashboardTitle(productId);

      // reset form
      document.getElementById("product").value = "";
      selectedRating = null;
      document.getElementById("review").value = "";
      document.querySelectorAll(".rating-btn").forEach(b =>
        b.classList.remove("active")
      );

      loadDashboard(lastSelectedProduct);
    })
    .catch(() => {
      status.textContent = "Submission failed. Please try again.";
      status.style.color = "red";
    });
};


//load dashboard
function loadDashboard(productId = lastSelectedProduct) {
  // const productId = lastSelectedProduct;

  fetch(`http://localhost:3000/feedback/dashboard/${productId}`)
    .then(res => res.json())
    .then(data => {
      lastDashboardData = data;

      document.getElementById("insightOutput").innerHTML = "";

      renderSentimentChart(data.sentiment);
      renderThemes(data.themes);
    })
    .catch(err => console.error(err));
}


//pie chart generator
function renderSentimentChart(sentiment) {
  const total =
    sentiment.positive + sentiment.negative + sentiment.neutral;

  const chartContainer = document.getElementById("sentimentChart");
  const countsContainer = document.getElementById("sentimentCounts");

  //  No chart when no review
  if (total === 0) {
    if (sentimentChart) {
      sentimentChart.destroy();
      sentimentChart = null;
    }

    chartContainer.style.display = "none";
    countsContainer.innerHTML = "<p>No reviews available for this product.</p>";
    return;
  }

  chartContainer.style.display = "block";

  if (sentimentChart) sentimentChart.destroy();

  sentimentChart = new Chart(chartContainer.getContext("2d"), {
    type: "pie",
    data: {
      labels: ["Positive", "Negative", "Neutral"],
      datasets: [{
        data: [
          sentiment.positive,
          sentiment.negative,
          sentiment.neutral
        ],
        backgroundColor: ["#7cb342", "#e53935", "#fbc02d"]
      }]
    }
  });

  countsContainer.innerHTML = `
    <p><strong>Total Reviews: ${total}</strong></p>
    <p>Positive: ${sentiment.positive}</p>
    <p>Negative: ${sentiment.negative}</p>
    <p>Neutral: ${sentiment.neutral}</p>
  `;
}


//theme count 
function renderThemes(themes) {
  const container = document.getElementById("themeSummary");
  container.innerHTML = "<h3>THEME BREAKDOWN</h3>";

  if (Object.keys(themes).length === 0) {
    container.innerHTML += "<p>No theme data available.</p>";
    return;
  }


  for (const theme in themes) {
    container.innerHTML += `<p>${theme}: ${themes[theme]}</p>`;
  }
}

//update dashboard according to last submission
function updateDashboardTitle(productId) {
  const map = {
    ring_1: "Ring",
    earring_1: "Earring",
    necklace_1: "Necklace",
    pendant_1: "Pendant",
    bracelet_1: "Bracelet"
  };

  document.getElementById("dashboardTitle").textContent =
  `Insights for: ${map[productId]}`;
}


//generate insight function
function generateInsights() {
  const container = document.getElementById("insightOutput");
  container.innerHTML = "<h3>Insights</h3><div class='insight-box'></div>";

  if (!lastDashboardData) {
    container.innerHTML += "<p>No data available.</p>";
    return;
  }

  const {sentiment, themes} = lastDashboardData;

  const totalReviews =
    sentiment.positive + sentiment.negative + sentiment.neutral;

  if (totalReviews === 0) {
    container.innerHTML += "<p>No insights available yet. Submit reviews to generate insights.</p>";
    return;
  }

  const insights = [];

  // Durability issues 
  if ((themes.durability || 0) >= 2 && sentiment.negative > sentiment.positive) {
    insights.push(
      "Multiple durability issues detected, improve material strength and quality."
    );
  }

  // Comfort issues 
  if ((themes.comfort || 0) >= 2 && sentiment.negative > sentiment.positive) {
    insights.push(
      "Multiple comfort related complaints found, try more lighter designs."
    );
  }

  // appearance feedback
  if((themes.appearance || 0) >= 2 && sentiment.positive < sentiment.negative){
    insights.push(
      "Customers complains about the product appearance, improve designs and shine");
  }

  // Overall negative sentiment
  if (sentiment.negative > sentiment.positive) {
    insights.push(
      "Overall sentiments are negative, review the product."
    );
  }

  // neutral review
  if (insights.length === 0) {
    insights.push(
      "Feedback is balanced with no major issues detected."
    );
  }

  insights.forEach(text => {
    container.querySelector(".insight-box").innerHTML += `<p>• ${text}</p>`;
  });
}


//display insight text
function displayInsights(insights) {
  const container = document.getElementById("insightOutput");
  container.innerHTML = "<h3>Insights</h3>";

  insights.forEach(text => {
    container.innerHTML += `<p>• ${text}</p>`;
  });
}


document.getElementById("generateInsights").onclick = generateInsights;


document.getElementById("dashboardProduct").onchange = (e) => {
  lastSelectedProduct = e.target.value;
  updateDashboardTitle(lastSelectedProduct);
  loadDashboard(lastSelectedProduct);
};


// Initial loading of dashboard
updateDashboardTitle(lastSelectedProduct);
loadDashboard(lastSelectedProduct);


