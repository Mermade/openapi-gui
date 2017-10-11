FROM node:8
COPY . /app
WORKDIR /app
RUN yarn install
EXPOSE 3000
VOLUME [ "/app/data" ]
ENTRYPOINT ["yarn"]
CMD ["start"]
