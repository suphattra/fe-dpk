# ----------------------------------------------------------------------------------
# Install dependencies stage
FROM node:20.11.0 as dependencies

RUN mkdir /dpk_frondend
WORKDIR /dpk_frondend

COPY ./ /dpk_frondend

RUN npm install

RUN npm run build

CMD ["npm","run", "start"]