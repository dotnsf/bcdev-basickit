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

We assume we are going to use Hyperledger Fabric and Hyperledger Composer for blockchain platform. This Basic Kit is designed to be able to use that blockchain platform environment. But we assume you don't have Hyperledger environment (yet), we would provide 'non-blockchain' mode in this API service as default. In this 'non-blockchain' mode, you can use IBM Cloudant as 'faked' Hyperledger datastore, and API would be compatible/behave like Hyperledger.

So, please note you need to manually enable 'real-blockchain' mode if you use real one.

## Requisite

- If you are going to use Hyperledger Fabric and Hyperledger Composer for blockchain, you need to intall them first:

    - http://blog.idcf.jp/entry/hyperledger-fabric

- 2 Node.js servers( they can be in same single system )

    - for API and API document

    - for Application

- Edit settings.js under api/ and app/ both.

    - api/settings.js

        - Edit exports.basic_username and exports.basic_password, which are authentication for API document(/doc/).

        - If you are going to use 'non-blockchain' mode(default), edit exports.cloudant_username and exports.cloudant_password, which are authentication for IBM Cloudant.

        - If you are going to use 'real-blockchain' mode, edit exports.cloudant_db as blank(''). This means you are going to use Hyperledger Fabric based blockchain. You also need to compolete following process to deploy Business Network:

            - Install/Setup Hyperledger Fabric and Hyperledger Composer development environment:

                - http://blog.idcf.jp/entry/hyperledger-fabric

            - Install Hyperledger Composer Playground

                - `$ sudo npm install -g composer-cli`

                - `$ sudo npm install -g composer-rest-server`

                - `$ sudo npm install -g generator-hyperledger-composer`

                - `$ sudo npm install -g yo`

                - `$ sudo npm install -g composer-playground`

            - Create PeerAdmin card

                - `$ ./createPeerAdminCard.sh`

            - Deploy Business Network

                - `$ cd (this directory)/api/`

                - `$ composer runtime install --card PeerAdmin@hlfv1 --businessNetwork bcdev-basickit-network`

                - `$ composer network start --card PeerAdmin@hlfv1 --networkAdmin admin --networkAdminEnrollSecret adminpw --archiveFile bcdev-basickit-network.bna --file PeerAdmin@hlfv1.card`

            - Create Business Network Card for admin@bcdev-basickit-network with Composer Playground

                - `$ composer-playground`

                - Access to http://localhost:8080/login

                - Create Business Network Card for admin@bcdev-basickit-network

            - Import Business Network Card for admin@bcdev-basickit-network

                - `$ composer card import --file admin\@bcdev-basickit-network.card`

            - Ping to Business Network with admin@bcdev-basickit-network (for confirmation)

                - `$ composer network ping --card admin@bcdev-basickit-network`

    - app/settings.js

        - Edit exports.api_url to point API service.

## Install

### API and API document

- Copy all files in api/ folder

- `$ cd api/`

- `$ npm install`

- `$ node app`

- API service would run on port 3001 ( by default ).

    - We strongly recommend that you should execute POST /api/adminuser to create admin user before installing application.

        - `$ curl -XPOST -H 'Content-Type: application/json' 'http://**.**.**.**:3001/api/adminuser' -d '{"password":"XXXXXXXX"}'`

### Application

- Copy all files in app/ folder

- `$ cd app/`

- `$ npm install`

- `$ node app`

- Application would run on port 3000 ( by default ).

## Run Swagger-style API Document

You can browse http://**.**.**.**:3001/doc/ with your web browser.

## Run Application

You can browse http://**.**.**.**:3000/ with your web browser.

## Files

- api/ : API

- api/bcdev-basickit-network.bna : Sample BNA file

- api/public/doc/ : Online document for API

- api/public/doc/swagger.yaml : Swagger-styled online document file

- app/ : Web Application

- README.md

## References

- Hyperledger Fabric でブロックチェーン環境を構築

    - http://blog.idcf.jp/entry/hyperledger-fabric

- Developer Tutorial | Hyperledger Composer

    - https://hyperledger.github.io/composer/tutorials/developer-tutorial.html

- Writing a Node.js application | Hyperledger Composer 

    - https://hyperledger.github.io/composer/applications/node


## Licensing

This code is licensed under MIT.

## Copyright

2018 [K.Kimura @ IBM Japan](https://github.com/dotnsf) all rights reserved.

