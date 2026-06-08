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
//   // env: {
//   //   email: process.env.CYPRESS_EMAIL,
//   //   password: process.env.CYPRESS_PASSWORD,
//   //   apiUrl: process.env.CYPRESS_API_URL,
//   //   viewportWidth: 1280,
//   //   viewportHeight: 720,
//   //   video: false,
//   //   screenshotOnRunFailure: true,
//   // },

//   env: {
//     email: "louren.rubico@frontlinebusiness.com.ph",
//     pasword: "Louren23!",
//     baseUrl: "http://localhost:5173",
//     viewportWidth: 1280,
//     viewportHeight: 720,
//     video: false,
//     screenshotOnRunFailure: true,
//   },

//   e2e: {
//     setupNodeEvents(on, config) {
//       // implement node event listeners here
//     },
//   },
// });
