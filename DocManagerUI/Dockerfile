# build stage
FROM node:18 as build-stage
ARG VITE_LOGIN_SERVICE_URL
ARG VITE_API_URL
ARG VITE_REDIRECT_URI

ENV VITE_LOGIN_SERVICE_URL=$VITE_LOGIN_SERVICE_URL
ENV VITE_API_URL=$VITE_API_URL
ARG VITE_REDIRECT_URI=$VITE_REDIRECT_URI
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM jonasal/nginx-certbot:latest
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY conf /etc/nginx/conf.d/default.conf
WORKDIR /conf
CMD ["nginx", "-g", "daemon off;"]