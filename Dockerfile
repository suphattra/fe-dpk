# ----------------------------------------------------------------------------------
# Install dependencies stage
FROM node:20-alpine as dependencies
WORKDIR /app
COPY package.json package-lock.json ./
##RUN npm i -S react-loading-overlay --force
RUN npm install --frozen-lockfile

# ----------------------------------------------------------------------------------
# Build stage
FROM node:20-alpine as builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npm run build

CMD ["npm","run", "start"]