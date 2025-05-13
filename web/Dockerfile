# Build stage
FROM node:24-alpine AS build

WORKDIR /app

COPY . .

# Install dependencies
RUN npm ci

## Set PUBLIC_URL for React router
#ENV PUBLIC_URL=/ui

# Build the app
RUN npm run build

# Production stage
FROM nginx:1.28

# Copy built files from build stage
COPY --from=build /app/build /usr/share/nginx/html/

EXPOSE 80

#CMD ["nginx", "-g", "daemon off;"]
