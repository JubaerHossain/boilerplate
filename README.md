<h1 align="center">Boilerplate</h1>
<h3 align="center">( Express TS Sequelize )</h3>
## Install

```sh
npm install

## Enabled Husky

```sh
npx husky install

or

yarn husky install
```

## Generate Jwt Secret

```sh
npm run refresh:env-jwt
```

## Usage Development

```sh
npm run dev
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