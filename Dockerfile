# Config shit
FROM node:22-slim
WORKDIR /app

# Copy shit
COPY package*.json ./

# Install shit
RUN npm install

# Copy more shit
COPY src ./src
COPY assets ./assets
COPY config ./config
COPY public ./public
COPY tsconfig.json ./


# Run shit
CMD ["npm", "start"]