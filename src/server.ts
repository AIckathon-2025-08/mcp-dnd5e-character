import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { generateCharacter } from "./characterGenerator.js";

const server = new Server(
  {
    name: "mcp-dnd5e-character",
    version: "0.1.0"
  },
  {
    capabilities: {
      resources: {},
      tools: {}
    }
  }
);

export const generateCharacterSchema = z.object({
  race: z
    .string()
    .optional()
    .describe("Optional preferred race (e.g. Human, Elf, Dwarf). If omitted, a race will be chosen randomly."),
  class: z
    .string()
    .optional()
    .describe("Optional preferred class (e.g. Fighter, Wizard, Rogue). If omitted, a class will be chosen randomly."),
  level: z
    .number()
    .int()
    .min(1)
    .max(5)
    .optional()
    .describe("Optional level from 1 to 5. Defaults to 1.")
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "generate_character",
        description: "Generate a simple D&D 5e-style character with race, class, abilities, and a short background.",
        inputSchema: {
          type: "object",
          properties: {
            race: {
              type: "string",
              description: "Optional preferred race (e.g. Human, Elf, Dwarf). Case-insensitive."
            },
            class: {
              type: "string",
              description: "Optional preferred class (e.g. Fighter, Wizard, Rogue). Case-insensitive."
            },
            level: {
              type: "number",
              description: "Optional level from 1 to 5. Defaults to 1."
            }
          }
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== "generate_character") {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Unknown tool: ${request.params.name}`
        }
      ]
    };
  }

  const rawArgs = request.params.arguments ?? {};

  const args = generateCharacterSchema.safeParse(rawArgs);
  if (!args.success) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Invalid arguments for generate_character: ${args.error.message}`
        }
      ]
    };
  }

  const character = generateCharacter(args.data);

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(character, null, 2)
      }
    ]
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
  });
}
