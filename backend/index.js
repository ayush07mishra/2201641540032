
const express = require("express");
const bodyParser = require("body-parser");
const shortUrlRoutes = require("./routes/shorturls");
const requestLogger = require("./middleware/requestLogger");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(requestLogger);

app.use("/", shortUrlRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
