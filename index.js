const express = require("express");
const cors = require("cors");

const feedbackRoutes = require("./routes/route");

const app = express();

app.use(express.json());
app.use(cors());

//server check
app.get("/", (req, res) => {
  res.send("Feedback Hub Backend is running");
});

//register routes
app.use("/feedback", feedbackRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
