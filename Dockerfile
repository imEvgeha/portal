FROM nginx:1.12-alpine
WORKDIR /usr/share/nginx/html
COPY dist .
COPY ./src/config.js .
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
