// require("dotenv").config();
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
  },
});

// module.exports = defineConfig({
//   e2e: {
//     email: process.env.CYPRESS_EMAIL,
//     password: process.env.CYPRESS_PASSWORD,
//     apiUrl: process.env.CYPRESS_API_URL,
//     viewportWidth: 1280,
//     viewportHeight: 720,
//     video: false,
//     screenshotOnRunFailure: true,
//   },
// });
