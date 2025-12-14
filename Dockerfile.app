
ARG NODE_VERSION=22.15.1

FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig*.json nest-cli.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:${NODE_VERSION}-alpine
WORKDIR /app
COPY package*.json tsconfig*.json nest-cli.json ./
RUN npm install --legacy-peer-deps --omit=dev && npm cache clean --force
COPY --from=builder /app/src ./src
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/doc ./doc
EXPOSE 4000
CMD ["npm", "run", "start:dev"]

# Run the application as a non-root user.
# USER node

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
# COPY --from=deps /usr/src/app/node_modules ./node_modules
# COPY --from=build /usr/src/app/dist ./dist


# Expose the port that the application listens on.


# Run the application.
