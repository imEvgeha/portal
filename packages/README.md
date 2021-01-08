# Portal Micro-frontends

Micro-frontend architecture is a design approach in which a front-end app is decomposed into individual, semi-independent “microapps” working loosely together.
Portal micro-frontends can be deployed individually without dependency.

## Kubernetes config

-   Create new folder for mf at https://github-us.production.tvn.com/Nexus/kubernetes/tree/master/nexus-avails
-   Referring to https://github-us.production.tvn.com/Nexus/kubernetes/tree/master/nexus-avails/portal-media-asset-management add all the required files
-   in ingress.yaml add correct mf name and new host name where the script.js will be deployed
-   in deployment.yaml add the newly created mf name 

## Steps to split a domain into micro-frontend

-   Refer to packages/portal-media-asset-management for config files
-   Move/create the mf in the packages folder
-   In profiles/importMap.json add newly created mf name and path as: 
    "@portal-mf/[mf-path]": [url of deployed mf script.js file]
-   In new mf, update Jenkins file to have correct GIT urls for kubernetes newly created mf folder

## Jenkins Config

-   Create a new pipeline for this newly created mf
    referring to https://jenkins.vubiquity.com:8080/view/Avails%20Services/job/cs-portal-media-asset-management
-   While configuring the pipeline, add Repository URL: git@github-us.production.tvn.com:Nexus/portal.git;
    in Additional Behaviour section, add Local subdirectory for repo: packages/[mf-name]

## Notes
 
-   mf name should be of fashion: "@portal-mf/[mf-path]", example: "@portal-mf/event-management"
    this path will be used to host the mf
