# Build stage
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Accept CLIENT_PORT as a build argument (used by vite.config.ts)
# Default to 3000 to satisfy the config check during build
ARG CLIENT_PORT=3000
ENV CLIENT_PORT=$CLIENT_PORT

# Copy package.json and lock file for better caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the project (generates dist/ folder)
RUN npm run build

# ---
# Production stage
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build files from build stage to Nginx web root
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 (default for Nginx)
EXPOSE 80

# Nginx starts automatically by default in the official alpine image
CMD ["nginx", "-g", "daemon off;"]
