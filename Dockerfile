# Use a slim Node.js image to keep the container lightweight
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install only production dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# The app binds to port 5000 (as specified in your env requirements)
EXPOSE 5000

# Start the application
CMD [ "npm", "start" ]