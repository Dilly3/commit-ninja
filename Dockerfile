

# Use Node.js LTS version
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install nodemon globally
RUN npm install -g nodemon

# Copy package files
COPY package*.json ./

# Install dependencies including cors and its types
RUN npm install cors @types/cors express @types/express
#RUN npm install uuid install @types/uuid
RUN npm install class-transformer
RUN npm install typeorm-cursor-pagination --save
#RUN npm install express-validator
# Install dependencies
RUN npm install

# Copy app source code
COPY . .

ENV NODE_ENV=development
ENV PORT=7020

# Expose the port your app runs on
EXPOSE 7020

# Start the application using nodemon
# for production use "npm start"
# if you want to use nodemon for development use "npm run dev"

CMD [ "sh", "-c", "echo \"Starting in $NODE_ENV mode\" && if [ \"$NODE_ENV\" = \"production\" ]; then npm start; else nodemon; fi" ]
