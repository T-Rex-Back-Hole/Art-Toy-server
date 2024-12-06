import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "T-Rex API",
    description: "Automatically generated Swagger doc",
  },
  host: "localhost:5000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const routes = ["./server.js"];

swaggerAutogen(outputFile, routes, doc);
