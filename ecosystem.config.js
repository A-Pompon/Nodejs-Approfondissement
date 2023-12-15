module.exports = {
  apps: [
    {
      name: "app",
      script: "./www/app.js",
      env_production: {
        NODE_ENV: "production",
        PORT: 5000, // EXEMPLE
      },
      env_development: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      exec_mode: "cluster",
      instances: 3,
      max_memory_restart: "200M",
      error_file: "./logs/err.log",
    },
  ],
};
