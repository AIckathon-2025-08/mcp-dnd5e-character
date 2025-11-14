FROM node:20-alpine

WORKDIR /app

# Copy package metadata and TypeScript config
COPY package.json package-lock.json* tsconfig.json ./ 

# Copy source code
COPY src ./src

# Install dependencies and build the TypeScript project
RUN npm install && npm run build

# Default command: run the compiled MCP server
CMD ["node", "dist/server.js"]

