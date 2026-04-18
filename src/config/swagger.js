const swaggerJsdoc = require("swagger-jsdoc");

const port = process.env.PORT || 5000;
const serverUrl = process.env.SERVER_URL || `http://localhost:${port}`;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SG Foundation API",
      version: "1.0.0",
      description: "API documentation for testing SG Foundation backend routes.",
    },
    servers: [
      {
        url: serverUrl,
        description: "Current API server",
      },
    ],
    tags: [
      { name: "Contact", description: "Contact form APIs" },
      { name: "Volunteer", description: "Volunteer registration APIs" },
      { name: "Donation", description: "Donation and Razorpay payment APIs" },
    ],
    components: {
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "Something went wrong",
            },
          },
        },
        ContactRequest: {
          type: "object",
          required: ["name", "email", "message"],
          properties: {
            name: { type: "string", example: "John Doe" },
            email: { type: "string", format: "email", example: "john@example.com" },
            message: { type: "string", example: "I want to know more about your work." },
          },
        },
        Contact: {
          allOf: [
            { $ref: "#/components/schemas/ContactRequest" },
            {
              type: "object",
              properties: {
                _id: { type: "string", example: "661f1f1f1f1f1f1f1f1f1f1f" },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" },
              },
            },
          ],
        },
        VolunteerRequest: {
          type: "object",
          required: ["name", "email", "phone"],
          properties: {
            name: { type: "string", example: "Jane Doe" },
            email: { type: "string", format: "email", example: "jane@example.com" },
            phone: { type: "string", example: "9876543210" },
          },
        },
        Volunteer: {
          allOf: [
            { $ref: "#/components/schemas/VolunteerRequest" },
            {
              type: "object",
              properties: {
                _id: { type: "string", example: "661f1f1f1f1f1f1f1f1f1f1f" },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" },
              },
            },
          ],
        },
        CreateOrderRequest: {
          type: "object",
          required: ["amount"],
          properties: {
            amount: { type: "number", example: 500 },
            name: { type: "string", example: "John Donor" },
            email: { type: "string", format: "email", example: "donor@example.com" },
            contact: { type: "string", example: "9876543210" },
            type: { type: "string", example: "one-time" },
          },
        },
        CreateOrderResponse: {
          type: "object",
          properties: {
            order_id: { type: "string", example: "order_Nx1234567890" },
            amount: { type: "number", example: 500 },
            key: { type: "string", example: "rzp_test_xxxxxxxxxxxxxx" },
          },
        },
        VerifyPaymentRequest: {
          type: "object",
          required: [
            "razorpay_order_id",
            "razorpay_payment_id",
            "razorpay_signature",
            "amount",
          ],
          properties: {
            razorpay_order_id: { type: "string", example: "order_Nx1234567890" },
            razorpay_payment_id: { type: "string", example: "pay_Nx1234567890" },
            razorpay_signature: { type: "string", example: "generated_signature" },
            amount: { type: "number", example: 500 },
            name: { type: "string", example: "John Donor" },
            email: { type: "string", format: "email", example: "donor@example.com" },
            contact: { type: "string", example: "9876543210" },
            type: { type: "string", example: "one-time" },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
          },
        },
      },
    },
    paths: {
      "/api/contact": {
        post: {
          tags: ["Contact"],
          summary: "Submit a contact message",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ContactRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Contact message submitted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      contact: { $ref: "#/components/schemas/Contact" },
                    },
                  },
                },
              },
            },
            500: {
              description: "Server error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/api/volunteer": {
        post: {
          tags: ["Volunteer"],
          summary: "Submit a volunteer registration",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/VolunteerRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Volunteer registration submitted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      volunteer: { $ref: "#/components/schemas/Volunteer" },
                    },
                  },
                },
              },
            },
            500: {
              description: "Server error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/api/donation/create-order": {
        post: {
          tags: ["Donation"],
          summary: "Create a Razorpay donation order",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateOrderRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Razorpay order created successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/CreateOrderResponse" },
                },
              },
            },
            503: {
              description: "Donation service is not configured",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            500: {
              description: "Server error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/api/donation/verify": {
        post: {
          tags: ["Donation"],
          summary: "Verify a Razorpay payment",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/VerifyPaymentRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Payment verified successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SuccessResponse" },
                },
              },
            },
            400: {
              description: "Invalid payment signature",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SuccessResponse" },
                },
              },
            },
            503: {
              description: "Donation service is not configured",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            500: {
              description: "Server error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

module.exports = swaggerJsdoc(options);
