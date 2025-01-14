# Use Node.js LTS version
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install nodemon globally
RUN npm install -g nodemon

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci
RUN npm install
# Copy app source code
COPY . .

# Set environment variables
ENV NODE_ENV=development \
    PORT=7020

# Expose the port your app runs on
EXPOSE 7020

# Add healthcheck
HEALTHCHECK --interval=60s --timeout=60s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:7020 || exit 1

# Start the application
CMD [ "sh", "-c", "echo \"Starting in $NODE_ENV mode\" && if [ \"$NODE_ENV\" = \"production\" ]; then npm start; else npm run dev; fi" ]