FROM oven/bun:1.2.5-alpine
COPY ./ /usr/app
WORKDIR /usr/app
RUN bun install