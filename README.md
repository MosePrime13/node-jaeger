# Nodejs template

**Version 1.0.0**

This repo is a simple demo of nodejs production ready set up.

---

## Requirements and installation
* git clone git@ssh.dev.azure.com:v3/mosesomondi/node-template/node-template
* cd node-template
* touch .env and add a port, node_env and a project name
    * PORT=3010
    * NODE_ENV=development
    * PROJECT_NAME=myproject
* Request for database certs from DB manager [ ca.crt, myproject.crt, myproject.key ].

The certs should include at least the following environments [dev, uat, prod, sandbox]  

> Note: Project name must match db cert names 
 
Install globally
* npm install -g ts-node
* npm install -g typescript
* npm install -g sequelize-cli-typescript 

Run on locally in project folder
* npm install

## Language and framework
* [Typescript](https://www.typescriptlang.org/) 
* [Fastify](https://www.fastify.io/)

## Database and migrations

* Database - Cockroachdb and Postgresdb 9.6
* ORM - Sequelize

First ensure a build file is available for the migration compiled path

Run on locally in project folder
* npm run build


Migration supports the following commands:

* `status`: print current migration status
* `up/migrate`: executed all unexecuted migrations
* `down/reset`: revert all executed migrations
* `next/migrate-next`: execute the next pending migration
* `prev/reset-prev`: revert the previous executed migration
* `reset-hard`: reset the database using a dropdb/createdb postgres command

Creating models and migrations
```
sequelize model:generate --name User --attributes name:string,email:string
```

## Testing
* Jest

## Deployment
* Gitlab & Jenkins

---

## Contributors

- Moses O Omondi <mosesomondi@live.com>

---

## Licence & copyright

© hova.droid.com