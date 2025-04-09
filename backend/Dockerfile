FROM node:23-slim

WORKDIR /app

# Install system dependencies (including PostgreSQL client)
RUN apt-get update && apt-get install -y postgresql-client && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install -g npm@latest && npm install

# Copy the rest of the application files
COPY . .

# Expose the port your app runs on
EXPOSE 4001

# Copy and use custom entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
