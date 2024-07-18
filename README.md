# pro-ticket-backend

## Install

1. Clone .env.template to .env and configure the environment variables.
2. Run npm install to install the dependencies.
3. If a database is needed, configure the docker-compose.yml and run docker-compose up -d to start the desired services.
4. Run npm run dev to start the project in development mode.

---

## ▶️ Run Commands

To run the server, use the following commands:

```bash
# Run the server in development mode
npm run dev

# Build the project for production
npm run build

# Start the server in production mode
npm run start

```

---

## 📁 Project Directory Structure

```
└───src
├───config
├───data
│ └───mongo
├───domain
│ ├───datasources
│ ├───interfaces
│ ├───models
│ ├───repository
│ └───services
├───presentation
│ ├───auth
│ ├───controllers
│ ├───middlewares
│ └───routes
├───test
└───utils
```

### Directory Overview

#### `src`

The root directory for the application's source code.

#### `config`

Contains configuration files and environment variables for the application.

#### `data`

Contains data-related files and subdirectories.

- `mongo`: Contains MongoDB-related scripts and configurations.

#### `domain`

Contains the core business logic of the application.

- `datasources`: Defines the data sources used in the application.
- `interfaces`: Contains TypeScript interfaces and types used throughout the application.
- `models`: Defines the data models.
- `repository`: Contains repository implementations for data access.
- `services`: Contains service implementations for business logic.

#### `presentation`

Handles the presentation layer of the application, including controllers and routes.

- `auth`: Contains authentication-related controllers and routes.
- `controllers`: Contains controllers that handle incoming requests and responses.
- `middlewares`: Contains middleware functions for request processing.
- `routes`: Defines the application routes.

#### `test`

Contains test files for unit and integration testing.

#### `utils`

Contains utility functions and helper methods used throughout the application.
