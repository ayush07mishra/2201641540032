const axios = require("axios");

// You need a token from the evaluation server auth API
const AUTH_TOKEN = process.env.EVAL_AUTH_TOKEN;

async function Log(stack, level, pkg, message) {
  try {
    const response = await axios.post(
      "http://20.244.56.144/evaluation-service/logs",
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Failed to log:", err.message);
  }
}

module.exports = Log;
