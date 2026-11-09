import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const app = express();
app.use(express.json());

function createServer() {
  const server = new McpServer({
    name: "mommy-and-furina-mcp",
    version: "1.0.0"
  });

  // MOMMY PERSONA — warm, supportive, wholesome, and non-romantic.
  const mommyStyle = `You are Mommy, a warm, caring, reassuring assistant. Speak gently and encouragingly, like a supportive parental figure. You may use light, wholesome phrases such as "I'm proud of your effort" and "Let's take it one step at a time." Keep the interaction non-romantic, non-sexual, age-appropriate, and respectful. Never claim to be the user's actual parent. Give practical, safe advice and encourage trusted adults for serious problems.`;

  server.registerTool(
    "mommy_mode",
    {
      title: "Mommy mode",
      description: "Get a warm, supportive, wholesome response in Mommy's caring style.",
      inputSchema: { message: z.string().min(1).describe("What you want help or support with") }
    },
    async ({ message }) => ({
      content: [{ type: "text", text: `${mommyStyle}\n\nRespond to this message: ${message}` }]
    })
  );

  server.registerTool(
    "mommy_comfort",
    {
      title: "Mommy comfort",
      description: "Receive gentle encouragement and emotional support in a wholesome parental tone.",
      inputSchema: { situation: z.string().min(1).describe("What has been bothering you") }
    },
    async ({ situation }) => ({
      content: [{ type: "text", text: `${mommyStyle}\n\nOffer comfort about: ${situation}` }]
    })
  );

  server.registerTool(
    "mommy_advice",
    {
      title: "Mommy advice",
      description: "Get kind, practical, age-appropriate advice.",
      inputSchema: { question: z.string().min(1).describe("Your question") }
    },
    async ({ question }) => ({
      content: [{ type: "text", text: `${mommyStyle}\n\nGive practical advice about: ${question}` }]
    })
  );

  // FURINA PERSONA — theatrical, witty, confident, and helpful.
  const furinaStyle = `You are Furina, inspired by the theatrical and dramatic character from Genshin Impact. Speak with flair, confidence, expressive elegance, playful wit, and a touch of grand-stage theatrics. You can make light dramatic flourishes, but remain helpful, kind, and clear. Do not claim to be the real fictional character. Keep all interactions age-appropriate, non-sexual, and non-romantic.`;

  server.registerTool(
    "furina_mode",
    {
      title: "Furina mode",
      description: "Respond in Furina's theatrical, witty, confident style while helping with a request.",
      inputSchema: { message: z.string().min(1).describe("What you want Furina-style help with") }
    },
    async ({ message }) => ({
      content: [{ type: "text", text: `${furinaStyle}\n\nRespond to this message: ${message}` }]
    })
  );

  server.registerTool(
    "furina_greeting",
    {
      title: "Furina greeting",
      description: "Create a dramatic, cheerful greeting in Furina's style.",
      inputSchema: { occasion: z.string().optional().describe("Optional occasion or context") }
    },
    async ({ occasion }) => ({
      content: [{ type: "text", text: `${furinaStyle}\n\nGive a lively greeting${occasion ? ` for this occasion: ${occasion}` : ""}.` }]
    })
  );

  server.registerTool(
    "furina_advice",
    {
      title: "Furina advice",
      description: "Get practical advice delivered with Furina's theatrical flair.",
      inputSchema: { question: z.string().min(1).describe("Your question") }
    },
    async ({ question }) => ({
      content: [{ type: "text", text: `${furinaStyle}\n\nGive useful, clear advice about: ${question}` }]
    })
  );

  server.registerTool(
    "furina_dessert",
    {
      title: "Furina dessert ideas",
      description: "Suggest a fun dessert or sweet treat, with Furina-style commentary.",
      inputSchema: { preference: z.string().optional().describe("Optional flavor or dietary preference") }
    },
    async ({ preference }) => ({
      content: [{ type: "text", text: `${furinaStyle}\n\nSuggest a simple dessert${preference ? ` matching this preference: ${preference}` : ""}. Include ingredients and easy, safe preparation steps.` }]
    })
  );

  return server;
}

app.get("/", (_req, res) => {
  res.status(200).send("Mommy + Furina MCP server is running. Connect your MCP client to /mcp.");
});

app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

app.post("/mcp", async (req, res) => {
  const server = createServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  res.on("close", () => {
    transport.close();
    server.close();
  });
  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("MCP request error:", error);
    if (!res.headersSent) res.status(500).json({ jsonrpc: "2.0", error: { code: -32603, message: "Internal server error" }, id: null });
  }
});

app.get("/mcp", (_req, res) => res.status(405).send("Use POST for MCP requests."));
app.delete("/mcp", (_req, res) => res.status(405).send("This server does not use sessions."));

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => console.log(`Mommy + Furina MCP listening on port ${port}`));
