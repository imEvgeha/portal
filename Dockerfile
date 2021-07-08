# VU base image for Nginx with the AppD agent built in
# Note: this image requires that environmental variable APPDYNAMICS_API_KEY be defined!
#
FROM docker-core.vubiquity.com/vu-nginx-alpine:1.5.1
WORKDIR /usr/share/nginx/html
COPY dist .
EXPOSE 80 8082 8083
CMD ["nginx", "-g", "daemon off;"]
