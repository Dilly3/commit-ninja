# Use Node.js LTS version
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install nodemon globally
RUN npm install -g nodemon

# Copy package files
COPY package*.json ./

# Install all dependencies in one RUN command to reduce layers
RUN npm install \
    cors @types/cors \
    express @types/express \
    class-transformer \
    typeorm-cursor-pagination \
    node-cron \
    && npm install

# Copy app source code
COPY . .

# Set environment variables
ENV NODE_ENV=development \
    PORT=7020

# Expose the port your app runs on
EXPOSE 7020

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:7020 || exit 1

# Start the application
CMD [ "sh", "-c", "echo \"Starting in $NODE_ENV mode\" && if [ \"$NODE_ENV\" = \"production\" ]; then npm start; else npm run dev; fi" ]