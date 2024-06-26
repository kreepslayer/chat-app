# :v: Chat-App :v:

## It is an chat app which is based on _Angular_ and _NestJs_

## How to use it ?

Stack:

[<img src = "./MDicons/html.svg" height = "50px"/>](https://developer.mozilla.org/ru/docs/Learn/Getting_started_with_the_web/HTML_basics)
[<img src = "./MDicons/icons8-sass.svg" height = "50px"/>](https://sass-lang.com/)
[<img src = "./MDicons/angular.svg" height = "50px"/>](https://angular.io/)
[<img src = "./MDicons/nestjs-icon.svg" height = "50px" color = "red"/>](https://nestjs.com/)
[<img src = "./MDicons/postgresql-logo-svgrepo-com.svg" height = "50px"/>](https://www.postgresql.org/)
[<img src = "./MDicons/node-js.svg" height = "50px"/>](https://nodejs.org/en)

## How to run it ?

### Firstly clone the repo
1. Backend
```shell
cd chat-backend 
```
```shell
npm install 
```
- Create .env file in root and paste there:
    - JWT_SECRET = ``` your generated JWT Secret ```
    - DATABASE_URL = ``` your database (postgres) link ``` *I recommend use [neon tech](https://neon.tech/)*
```shell
npm run start dev
```
2. Frontend
```shell
cd ionic-chat-frontend
```
```shell
npm install
```
```shell 
ionic serve
```
---
