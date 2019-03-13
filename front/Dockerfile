FROM node:lts-alpine
# Set the working directory
WORKDIR /app
# Copy project specification and dependencies lock files
COPY package.json package-lock.json ./

RUN npm install

# Copy app sources
COPY . .
# Run linters and tests
# RUN yarn lint && yarn test

# Expose application port
EXPOSE 3000
# In production environment
RUN yarn build
ENV NODE_ENV production
# Run
CMD ["npm", "start"]


