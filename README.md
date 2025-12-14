# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/Max071298/nodejs2025Q4-service
```

## Installing NPM modules

```
npm install --legacy-peer-deps
```

## Create .env file from .env.example


## Running application

#### 1.Create .env file

```
cp .env.example .env
```

#### 2.Clear docker workspace from earlier content (images, containers, volumes). Hint: you must open your DockerDesktop application

```
docker system prune -a
```

#### 3.Clear old migrations and containers (strongly recommended to do this before running application)

```
npm run clean:docker-migrations
```

#### 4.Compose postgres image

```
npm run db:up
```

#### 5.Generate and run migrations

```
npm run migration:prepare
```

#### 6. Make docker compose for server and db and run the server

```
npm run docker:compose
```

#### Now u can ran all the tests and check work

####

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/api.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

**After application running** open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
