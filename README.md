# Travel Microservice FIUBER

[![codecov](https://codecov.io/github/taller2altego/travel-microservice/branch/main/graph/badge.svg?token=HXJYL9RXD4)](https://codecov.io/github/taller2altego/travel-microservice)

### Construido con:

[![Node][Node.js]][Node-url]
[![Express][Express.js]][Express-url]
[![MongoDB][PostgreSQL]][PostgreSQL-url]

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[Node.js]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/en/
[Express.js]: https://img.shields.io/badge/Express.js-404D59?style=for-the-badge
[Express-url]: https://expressjs.com/es/
[PostgreSQL]: https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white
[PostgreSQL-url]: https://www.mongodb.com/

## Dependencias

Utilizamos [npm](https://www.npmjs.com/) como gestor de paquetes, y [Docker](https://www.docker.com/) para el despliegue local.


## Instalacion:

Clonar el repositorio e instalar paquetes:

    $ git clone git@github.com:taller2altego/user-microservice.git
    $ npm install

Levantar el servicio con Docker local:

    $ npm run docker-up

Para instalar el linter:

    $ npm run prepare

## Test

Se pueden correr los test con:

    $ npm run coverage

## Linter
El linter utilizado es [ESlint](https://eslint.org/).

Para correr el linter:

    $ npm run lint

Para solucionar errores automaticos:

    $ npm run lint:fix

## Deploy app a Heroku

El deploy es manual, se debe instalar la CLI de Heroku, logearse en ella y configurar el remote

    $ heroku git:remote -a altego-fiuber-travel

Para deployar:

    $ git push heroku main

Y para ver los ultimos logs:

    $ heroku logs --tail

## Base de datos: MongoDB

La base de datos usada es [MongoDB](https://www.mongodb.com/).
