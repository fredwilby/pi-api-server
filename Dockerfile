FROM arm32v7/node:8

WORKDIR /app
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install
COPY ./src /app/src

RUN chown -R node /app
USER node
EXPOSE 8080

CMD ["node", "/app/src/index.js"]
