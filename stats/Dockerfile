# build environment
FROM node as builder

RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json
RUN npm install -g -s --no-progress yarn
RUN yarn add  react-scripts -g 
COPY . /usr/src/app 
RUN yarn build

# production environment
FROM nginx:1.13.9-alpine   
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]