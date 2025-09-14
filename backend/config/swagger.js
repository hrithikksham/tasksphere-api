import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tasksphere API",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"], // your route files with JSDoc comments
});

export { swaggerSpec, swaggerUi };
