const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();
const PORT = process.env.PORT || 5000;

const services = [
  { route: "/class-service", target: "http://localhost:3025" },
  { route: "/courses-service", target: "http://localhost:3015" },
  { route: "/login-service", target: "http://localhost:3005" },
  { route: "/registration-service", target: "http://localhost:3010" },
  { route: "/user-service", target: "http://localhost:3020" }
];


services.forEach(({ route, target }) => {
  const proxyOptions = {
    target,
    timeout: 60000,
    changeOrigin: true,
    pathRewrite: {
      [`^${route}`]: ""
    }
  };
  app.use(route, createProxyMiddleware(proxyOptions));
});

// Lắng nghe trên cổng đã chỉ định
app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});