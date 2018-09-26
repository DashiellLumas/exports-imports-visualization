FROM node:6

RUN git clone https://github.com/DashiellLumas/us-exports-imports-map

WORKDIR /us-exports-imports-map

RUN npm install

EXPOSE 8081

RUN ["yarn", "build"]

CMD ["yarn", "start"]
