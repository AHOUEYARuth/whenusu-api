
ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
#ENV NODE_ENV production


WORKDIR /usr/src/app

# Copy package files first (better caching)
COPY package.json package-lock.json ./

# Install ALL dependencies (including dev)
RUN npm install

# Copy the rest of the source files into the image.
COPY . .


# Expose the port that the application listens on.
EXPOSE 3333

# Run the application.
CMD npm run dev
