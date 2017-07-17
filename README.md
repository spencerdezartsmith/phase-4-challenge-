# Vinyl

A community for record enthusiasts to review their favorite albums.

Part of the application has already been built for you. Your job is to take it to completion.

## Getting Started

Clone down the project to your own machine
  - Navigate to `phase-4-challenge` and open the project in your editor of choice
  - In the root of the project create a folder called `config`
  - Inside that folder, create a new file and call it config.json
  - Put the following piece json object into the config.json file
  ```ruby
  {
	"SECRET": "followyourdreams"
  }
  ```

Run `$ npm install` to install dependencies
Run `$ npm run db:drop` (just incase you have a db called vinyl already)
Run `$ npm run db:create` to create database  
Run `$ npm run db:schema` to set up tables  
Run `$ npm run db:seed-albums` to load album seed data 
Run `$ npm run start` to create server instance

Go to http://localhost:3000/
  - From the homepage, navigate to the **Register** link and sign up
  - **Head back to the command line and run** `$ npm run db:seed-reviews`
  - Head back to the homepage and **Login**
  - You are now able to navigate all around the site freely
  - Have opinions
  - Have fun :)

## Screenshots

![alt tag](http://i.imgur.com/OtpxzStb.png)

## Author:
  Spencer Dezart-Smith
