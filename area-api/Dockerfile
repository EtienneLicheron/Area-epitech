FROM --platform=linux/amd64 node:lts-alpine

WORKDIR /usr/src/app

# Install supervisord build dependencies and nginx
RUN apk update
RUN apk add --no-cache build-base python3-dev nginx

# Install pip
RUN python3 -m ensurepip
RUN pip3 install --upgrade pip setuptools

# Install supervisord
RUN pip3 install supervisor

# Install dependencies for build
COPY package*.json ./
RUN npm install

# Build and remove source files
COPY . .
RUN npm run build
RUN cp -r src/constants dist/tmp.constants
RUN rm -rf src && mkdir src
RUN cp -r dist/tmp.constants src/constants
RUN rm -rf dist/tmp.constants

# Copy configuration files
COPY nginx.conf /etc/nginx/nginx.conf
COPY supervisord.conf /etc/supervisord.conf

# Change domain in nginx configuration (default: localhost)
ARG DOMAIN=localhost
RUN sed -i "s/localhost/$DOMAIN/g" /etc/nginx/nginx.conf

# Create log directory for nginx
RUN mkdir /etc/nginx/logs

# Start
EXPOSE 8080
CMD ["supervisord", "-c", "/etc/supervisord.conf"]
