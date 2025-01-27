export default {
    apps: [
      {
        name: "my-app",
        script: "./dist/index.js", // Point to the compiled JS file
        instances: 1,
        autorestart: true,
        watch: false,
        env: {
          GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
          GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        }
      }
    ]
  };
  