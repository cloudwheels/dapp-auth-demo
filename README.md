# Web Dapp Sample

Basic demo of a Dash dapp to demonstrate user auth.

# Usage

## Overview

This is an experimental project to explore methods of achieving a login flow with the [Dash Platform](https://dashdevs.org/).

The current specification can be found [here](https://docs.google.com/document/d/1LDXEC0FtOoIOQomMjPmBm8x6-ZYVZPDVwnr1VoC6k-o).

This repo contains the impementation of the server-side component. The client side component is the [Dash Chrome Wallet](https://github.com/readme55/Dash-Chrome-Wallet).

## Prerequisites

Session storage using the built in MemoryStore is not recommended in a production environment. You should install Redis or connect to a remote Redis service and add the configuration to your .env file (see below). If Redic connection information is not configured, the server will fall back to using MemoryStore.

## Installation

### Clone this repo to a suitable location and switch into the project directory

    git clone https://github.com/dashmachine/web-dapp-sample && cd dapp-auth-demo

### Install npm packages

    npm i

### Configure environment variables

The app looks for environment variables in the file `app/config/.env`.
You can copy the example file `app/config/.env.example` to that location.

### Run in production mode

    npm start

The server will run on port 3000 unless an alternative `SERVER_PORT` is configured in the `.env` file (see above).

### Note: Use of esm package (experimemtal)

Scripts are currently configured to use the npm package `esm` to allow for the use of es6 syntax without babel. See the esm package documentation for more details.

# Development

The following sections are only of interest if you wish to develop this project. 

It is recommended to install the npm nodemon package globally

    npm i -g nodemon

The project can then be started in development mode using the following npm script:

    npm run develop

## Tests

Tests are configured using Jest and Supertest. The following scripts are available to run different sections of tests, optionally in `watch` mode:

    npm test

Single run of all tests

    npm test:watch

Runs all tests in watch mode

    npm test-unit:watch

Runs only unit tests in watch mode

    npm test-routes:watch

Runs only route tests (using supertest) in watch mode

    npm test-services:watch

Runs only route services in watch mode

