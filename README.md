# bcdev-basickit

Basic Kit for Blockchain application development

## Overview

Basic Kit for Blockchain application development.

In Blockchain application development, we would develop following three elements almost all time. So we would create this kind of working skelton:

    - API service

        - API service would provide REST API to access Blockchain platform.

    - Application

        - Application would be a (web) application for user which contains UI/UX also. This can be a sample application which use API service.

    - API document

        - Online API document would be necessary for application developer. In this basic kit, we would provide swagger-styled online working document.

We assume we are going to use Hyperledger Fabric and Hyperledger Composer for blockchain platform. This Basic Kit is designed to use this blockchain platform environment. But in case you don't have Hyperledger environment (yet), we would provide 'non-blockchain' mode in this API service. In this 'non-blockchain' mode, you can use IBM Cloudant as 'faked' Hyperledger datastore, and API would be compatible/behave like Hyperledger.

## Requisite

- 2 Node.js servers( they can be in same single system )

    - for API and API document

    - for Application

- Edit settings.js under api/ and app/ both.

    - api/settings.

        - Edit exports.basic_username and exports.basic_password, which are authentication for API document(/apidoc.html).

        - If you are going to use 'non-blockchain' mode, edit exports.cloudant_username and exports.cloudant_password, which are authentication for IBM Cloudant.

    - app/settings.

        - Edit exports.api_url to point API service.

## Install

### API and API document

- Copy all files in api/ folder

- `$ cd api/`

- `$ npm install`

- `$ node app`

- API service would run on port 3001 ( by default ).

    - We strongly recommend that you should execute POST /api/adminuser to create admin user before installing application.

### Application

- Copy all files in app/ folder

- `$ cd app/`

- `$ npm install`

- `$ node app`

- Application would run on port 3000 ( by default ).

## Run Application

You can browse http://**.**.**.**:3000/ with your web browser.

## Files

- api/ : API

- api/public/doc/ : Online document for API

- api/public/doc/swagger.yaml : Swagger-styled online document file

- app/ : Web Application


- README.md

## Licensing

This code is licensed under MIT.

## Copyright

2018 [K.Kimura @ Juge.Me](https://github.com/dotnsf) all rights reserved.
