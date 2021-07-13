<h1 align="center">expresso</h1>
<h3 align="center">( Express TS Sequelize )</h3>
<br/>

[![version](https://img.shields.io/badge/version-2.25.0-blue.svg?cacheSeconds=2592000)](https://github.com/masb0ymas/expresso/releases/tag/v2.25.0)
[![Node](https://img.shields.io/badge/Node-12.18.0-informational?logo=node.js&color=43853D)](https://nodejs.org/docs/latest-v12.x/api/index.html)
[![TypeScript](https://img.shields.io/badge/Typescript-4.3.2-informational?logo=typescript&color=2F74C0)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.17.1-informational?logo=express&color=B1B1B1)](https://expressjs.com/)
[![documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://github.com/masb0ymas/expresso#readme)
[![maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/masb0ymas/expresso/graphs/commit-activity)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/masb0ymas/expresso/blob/master/LICENSE.md)

> Just Boilerplate Express with TypeScript ( 🦊 )

## Prerequisites

- npm >= `v6.x`
- node >= `v10.x`
- eslint `v7.x`
- husky >= `v5.x`
- Familiar with TypeScript 💪

## Feature

- [TypeScript](https://github.com/microsoft/TypeScript) `v4.x`
- [Sequelize ORM](https://github.com/sequelize/sequelize) `v6.x`
- [Nodemailer](https://github.com/nodemailer/nodemailer)
- [Handlebars](https://github.com/wycats/handlebars.js) for templating HTML
- [Yup](https://github.com/jquense/yup) for validation schema
- JavaScript Style [Airbnb Base](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base)
- Formating code using [Prettier](https://github.com/prettier/prettier) Integration [Eslint](https://github.com/prettier/eslint-config-prettier) and [TypeScript Eslint](https://github.com/typescript-eslint/typescript-eslint#readme)
- Using [Babel Resolver](https://github.com/tleunen/babel-plugin-module-resolver) for simplify the require/import paths
- Documentation with [Swagger](https://github.com/swagger-api/swagger-ui)
- Generate Log File with [Winston](https://github.com/winstonjs/winston)
- [Convensional Commit](https://www.conventionalcommits.org/en/v1.0.0/) with [Husky](https://github.com/typicode/husky) & [Commitlint](https://github.com/conventional-changelog/commitlint)

### [Check Full Documentation](https://github.com/masb0ymas/expresso/blob/master/docs/repo/intro.md)

## How to use

clone this repo with `https` / `ssh` / `github cli`

```sh
git clone https://github.com/masb0ymas/expresso.git
```

After cloning this repo, make sure you have `duplicated` the `.env.example` file to `.env`, don't let the .env.example file be deleted or renamed.

## Install

```sh
npm install

or

yarn
```

## Enabled Husky

```sh
npx husky install

or

yarn husky install
```

## Generate Jwt Secret

```sh
npm run refresh:env-jwt

or

yarn refresh:env-jwt
```

## Usage Development

```sh
npm run dev

or

yarn dev
```

## Type Check

```sh
npm run type-check

or

yarn type-check
```

## Type Check Watch mode

```sh
npm run type-check:watch

or

yarn type-check:watch
```

## Build

Recommended using build with `Babel`, build with `TS` is still unstable

```sh
npm run build:babel

or

yarn build:babel
```

## Using Sequelize

Using sequelize with development mode, you can set the database configuration in `.env`, like this :

```sh
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=example_database
DB_USERNAME=example_user
DB_PASSWORD=example_password
DB_OPERATOR_ALIAS=
DB_TIMEZONE=+07:00
```

if you set production mode change the database config `PROD_DB_DATABASE`

then after that you can adjust the database config in `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`.
now you can run this command :

```sh
npm run db:reset

or

yarn db:reset
```

## Usage Production

```sh
npm run serve:production

or

yarn serve:production
```

## Usage PM2 for Cluster Process

```sh
pm2 start ecosystem.config.js --env=production
```

## Run loadtest

```sh
npm install -g loadtest
```

Then run the app that you want to test with `node app.js`. We’ll start by testing the version that doesn’t use clustering.

With the app running, open another Terminal and run the following load test:

```sh
loadtest http://localhost:8000/v1/user -n 1000 -c 100
```

`-n` = network / requests

`-c` = concurrency

`--rps` = request per second

Read documentation [loadtest](https://www.npmjs.com/package/loadtest)

## Result loadtest:

if you want to try `1000 requests` you have to increase `RATE_LIMIT=1000`, by default `100 requests`

```sh
Requests: 0 (0%), requests per second: 0, mean latency: 0 ms

Target URL:          http://localhost:8000/v1/user
Max requests:        1000
Concurrency level:   100
Agent:               none

Completed requests:  1000
Total errors:        0
Total time:          1.7057602980000002 s
Requests per second: 586
Mean latency:        162.8 ms

Percentage of the requests served within a certain time
  50%      136 ms
  90%      261 ms
  95%      337 ms
  99%      390 ms
 100%      419 ms (longest request)
```

## Run tests

```sh
npm run test

or

yarn test
```

## Run with Docker

Adjust the config in .env like this:

```sh
...

PORT=7000 # change this port according to your needs

...

DB_CONNECTION=mysql
DB_HOST=db # access to service db in docker
DB_PORT=3306
DB_DATABASE=example
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_OPERATOR_ALIAS=
DB_TIMEZONE=+07:00

...

PROD_DB_CONNECTION=mysql
PROD_DB_HOST=db
PROD_DB_PORT=3306
PROD_DB_DATABASE=example
PROD_DB_USERNAME=your_username
PROD_DB_PASSWORD=your_password
PROD_DB_OPERATOR_ALIAS=
PROD_DB_TIMEZONE=+07:00

...

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=your_password
REDIS_PORT=6380 # Default: 6379
```

`container_name` in each service is customizable.

`PORT=...` If you want to use a port other than `7000`, you must also change the port in the services `app`

```yaml
services:
  app:
    build:
      context: .
    container_name: express_app
    depends_on:
      - db
      - redis
    restart: always
    ports:
      - '7000:7000'
```

`DB_HOST=..`. must be accessed using IPv4 Docker Network services `db`.

```yaml
db:
  image: mariadb
  container_name: express_db
  volumes:
    - ./storage/mariadb-volume:/var/lib/mysql
  environment:
    MYSQL_ROOT_PASSWORD: ${PROD_DB_PASSWORD}
    MYSQL_DATABASE: ${PROD_DB_DATABASE}
    MYSQL_USER: ${PROD_DB_USERNAME}
    MYSQL_PASSWORD: ${PROD_DB_PASSWORD}
  restart: always
  ports:
    - '3307:3306'
  networks:
    - express_network
```

After all the above configuration is adjusted, you can run it with the command:

Command aggregates the output of each container

```sh
docker-compose up
```

Detached mode: Run containers in the background,

```sh
docker-compose up -d
```

## Release your version app

if you want to release the app version, you can use the following command :

```sh
npm run release

or

yarn release
```

## SMTP Basic

I use [topol.io](https://topol.io/) to create email templates, and it's free and can export to html format

```sh
MAIL_DRIVER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=465
MAIL_AUTH_TYPE=
MAIL_USERNAME=your_mail@domain.com
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=
```

## SMTP with Mailgun API

```sh
MAILGUN_API_KEY=your_api_key_mailgun
MAILGUN_DOMAIN=your_domain
```

## SMTP Google Oauth Email ( Gmail )

```sh
MAIL_DRIVER=gmail
MAIL_HOST=
MAIL_PORT=
MAIL_AUTH_TYPE=OAuth2
MAIL_USERNAME=your_account@gmail.com
MAIL_PASSWORD=
MAIL_ENCRYPTION=

OAUTH_CLIENT_ID=your_client_id
OAUTH_CLIENT_SECRET=your_client_secret
OAUTH_REDIRECT_URL=https://developers.google.com/oauthplayground
OAUTH_REFRESH_TOKEN=your_refresh_token
```

[Setup Google Oauth](https://medium.com/@nickroach_50526/sending-emails-with-node-js-using-smtp-gmail-and-oauth2-316fe9c790a1)

## Author

👤 **masb0ymas**

- Website: https://resume.masb0ymas.vercel.app
- Twitter: [@masb0ymas](https://twitter.com/masb0ymas)
- Github: [@masb0ymas](https://github.com/masb0ymas)
- LinkedIn: [@masb0ymas](https://www.linkedin.com/in/masb0ymas/)

## Support Me

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/I2I03MVAI)

[<img height="40" src="https://trakteer.id/images/mix/navbar-logo-lite.png">](https://trakteer.id/masb0ymas)

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
