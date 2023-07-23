module.exports = {
    apps: [
      {
        name: "nextjs-app",
        script: "node_modules/next/dist/bin/next",
        args: "start",
        instances: "max", // Set the number of instances. "max" will use the maximum available cores
        exec_mode: "cluster", // Use cluster mode for better performance
        env: {
          NODE_ENV: "production",
        },
      },
    ],
  };
  