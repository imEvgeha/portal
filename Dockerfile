FROM docker-core.vubiquity.com/vu-nginx-alpine:vu-nginx-1.18-alpine.1.0
WORKDIR /usr/share/nginx/html
COPY dist .
#COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
