FROM node:9.4.0-stretch
RUN mkdir -p /app
WORKDIR /app
COPY . .

ENV REDIS_HOST=localhost
ENV REDIS_PORT=6379

EXPOSE 8000
CMD node index.js
