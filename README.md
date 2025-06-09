<p align="center">
  <h1>Loan Application System</h1>
</p>

## Description

This project implements a robust and simple Loan Application System backend. It is designed to manage clients and their loan applications, featuring secure authentication, specific business logic constraints, and comprehensive API documentation. The system is built using the [Nest](https://github.com/nestjs/nest) TypeScript backend framework, integrated with [TypeORM](https://github.com/typeorm/typeorm) for database interaction and PostgreSQL as the relational database.

## Project setup

Install dependencies using the command below. If using pnpm, change `npm` to `pnpm`.

```bash
$ npm install
```

Create a `.env.local` file in the root directory of the project. This file will store your environment-specific variables, particularly database credentials and authentication secrets.

```
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_HOST=
DATABASE_PORT=
DATABASE_NAME=
AUTH_SECRET=
AUTH_EXPIRES=
```

Note: It is highly recommended to use PostgreSQL as the relational database for this application. Ensure your PostgreSQL server is running and accessible with the provided credentials.

## Compile and run the project

Once the setup is complete, you can compile and run the application using the following commands:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# with .env file (recommended)
$ npm run start:env

# watch mode with .env file
$ npm run start:dev-env
```

## Swagger documentation

An interactive API documentation is available via Swagger UI. After running the application (e.g., using npm run start:dev-env), open your web browser and navigate to:

`http://localhost:8080/api`

This interface allows you to view all available endpoints, their expected request bodies, response schemas, and even test them directly from your browser.
All endpoints, except `POST /auth/register` and `POST /auth/login`, require authentication. You can obtain an accessToken by logging in via `POST /auth/login`. This token should then be used in the Authorization header for protected routes (e.g., `Bearer YOUR_ACCESS_TOKEN`). Some routes are additionally restricted to users with an `admin` role.

## Models

The core data models used in this application are defined below:

```
export class BaseEntity {
  id: string;
  createdDate: Date;
  updatedDate: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  GUEST = 'guest',
  STAFF = 'staff',
}

export class AuthUser extends BaseEntity {
  username: string;
  passwordHash: string;
  role: UserRole;
  clients?: Client[];
}

export class Client extends BaseEntity {
  name: string;
  national_id: string;
  phone_number: string;
  loans?: Loan[];
  user_id: string;
  user: AuthUser;
}

export enum LoanStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

export class Loan extends BaseEntity {
  amount: number;
  interest_rate: number;
  status: LoanStatus;
  client_id: string;
  client?: Client;
}

```
