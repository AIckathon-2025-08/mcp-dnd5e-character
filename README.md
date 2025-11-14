# D&D 5e Character MCP Server

D&D 5e Character MCP Server is a small Model Context Protocol server that generates simple, ready-to-use Dungeons & Dragons 5e–style characters on demand.

The goal is to provide an easy way for an MCP-enabled AI client to create random or lightly customized characters (race, class, level) that are "D&D-flavored" but lightweight enough for demos and one-shots.

---

## Preview

![Character Screenshot 1](./screenshot-1.png)  

_Example MCP client request and JSON response with a generated character._



![Character Screenshot 2](./screenshot-2.png)  

_Another example character with different race/class options._



### Demo Video

[demo.mp4](./demo.mp4)  

_Short terminal recording showing `docker compose up`, the MCP server starting, and a client calling the `generate_character` tool._



---

## Available Commands

| Command                    | Description                                                                 |
| -------------------------- | --------------------------------------------------------------------------- |
| `npm install`              | Install project dependencies                                                |
| `npm run dev`              | Run the MCP server in development mode with TypeScript and hot reload      |
| `npm run build`            | Compile the TypeScript source into JavaScript in the `dist` folder         |
| `npm start`                | Run the compiled MCP server from the `dist` folder                         |
| `docker compose build`     | Build the Docker image for the MCP server                                  |
| `docker compose up`         | Start the MCP server in a container (attached mode)                        |
| `docker compose up -d`     | Start the MCP server in a container (detached/background mode)             |
| `docker compose ps`        | Show the status of the running container                                   |
| `docker compose down`      | Stop and remove the container and its network                              |

---

## Requirements

To run this project, you need:

- **Node.js** `>= 18` (for local development and npm scripts)

- **npm** (comes with Node.js)

- **Docker Desktop** (or Docker Engine) with `docker compose` available on your PATH

You can use either the pure Node.js workflow or the Docker workflow depending on your preference.

---

## Project Structure

The project is intentionally small and focused:

- `src/server.ts` — MCP server implementation and the `generate_character` tool wiring  

- `dist/server.js` — compiled JavaScript output (created by `npm run build`, not committed to the repo)  

- `Dockerfile` — Docker image definition for the server  

- `docker-compose.yml` — docker compose configuration with a single `mcp-dnd5e-character` service  

- `notes.md` — internal notes and the draft character format  

The server exposes a single MCP tool:

- `generate_character` — generates a simple D&D 5e–style character with:

  - race, class, level  

  - ability scores (STR, DEX, CON, INT, WIS, CHA)  

  - hit points, armor class, speed  

  - skills and starting equipment  

  - alignment and a short background sentence  

---

## Running Locally (Node.js)

Install dependencies:

```bash
npm install
```

Build the TypeScript project:

```bash
npm run build
```

Run the compiled MCP server:

```bash
npm start
```

Or, to run directly in development mode with TypeScript and watch:

```bash
npm run dev
```

In all cases, the MCP server communicates over stdin/stdout and is intended to be used by an MCP-compatible client.

## Running with Docker

This project includes Docker support so you do not need to install Node.js locally for production-style runs.

### Build the image

```bash
docker compose build
```

### Start the container (attached)

```bash
docker compose up
```

This will:

- Build the Docker image (if not already built)

- Run the MCP server inside a container named `mcp-dnd5e-character`

- Attach the terminal to the server process (stdin/stdout)

To stop the server, press `Ctrl + C` and then:

```bash
docker compose down
```

### Start the container (detached)

If you prefer to run the container in the background:

```bash
docker compose up -d
```

Check the status:

```bash
docker compose ps
```

Stop and remove the container:

```bash
docker compose down
```

## Using the MCP Tool

This server is designed to be used from an MCP-compatible client (for example, an AI assistant that supports the Model Context Protocol).

The server exposes one tool:

**Tool name:** `generate_character`

**Description:** Generate a simple D&D 5e–style character with race, class, abilities, hit points, and a short background.

**Input schema** (all fields optional):

- `race` — preferred race (e.g. "Human", "Elf", "Dwarf"), case-insensitive

- `class` — preferred class (e.g. "Fighter", "Wizard", "Rogue"), case-insensitive

- `level` — level from 1 to 5 (defaults to 1 if omitted)

**Example tool call** (conceptual):

```json
{
  "name": "generate_character",
  "arguments": {
    "race": "Dwarf",
    "class": "Barbarian",
    "level": 1
  }
}
```

**Example output** (shape):

```json
{
  "name": "Bruen",
  "race": "Dwarf",
  "class": "Barbarian",
  "level": 1,
  "abilities": {
    "strength": 17,
    "dexterity": 12,
    "constitution": 16,
    "intelligence": 10,
    "wisdom": 11,
    "charisma": 9
  },
  "hit_points": 18,
  "armor_class": 16,
  "speed": 25,
  "skills": ["Athletics", "Survival", "Intimidation"],
  "equipment": ["Greataxe", "Handaxe", "Traveler's Clothes"],
  "background": "Bruen is a level 1 Dwarf Barbarian of Chaotic Good alignment. They are known for their Athletics and travel the world with their greataxe.",
  "alignment": "Chaotic Good"
}
```

The exact numbers will vary because the character is generated with light randomness, but the overall structure remains the same.

## Aickathon Notes

**Theme:** Build an MCP server of your choice

**Idea:** D&D 5e character generator MCP server

**Use case:** Quickly create flavorful characters for one-shots, demos, or testing MCP integrations.

**Docker-ready:** The project can be built and run with docker compose commands as described above.

This README follows the spirit of the game-of-life example: short description, preview section, commands table, requirements, and clear Docker instructions.
