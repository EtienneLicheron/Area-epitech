FROM node:lts-alpine as build-stage

WORKDIR /usr/src/app

# Install dependencies for build
COPY package*.json ./
RUN npm install

# Build and remove source files
COPY . .
RUN npm run build
RUN rm -rf src

# Start
FROM nginx:stable-alpine

# Copy build and configurations files to nginx
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# Change domain in nginx configuration (default: localhost)
ARG DOMAIN=localhost
RUN sed -i "s/localhost/$DOMAIN/g" /etc/nginx/nginx.conf

# Create log directories
RUN mkdir /etc/nginx/logs

EXPOSE 8081
CMD ["nginx", "-g", "daemon off;"]
