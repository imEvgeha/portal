# VU base image for Nginx with the AppD agent built in
# Note: this image requires that environmental variable APPDYNAMICS_API_KEY be defined!
#
FROM docker-core.vubiquity.com/vu-nginx-alpine:vu-nginx-1.19.1-alpine.1.4
WORKDIR /usr/share/nginx/html
COPY dist .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
