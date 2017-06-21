# Vinyl

A community for record enthusiasts to review their favorite albums.

Part of the application has already been built for you. Your job is to take it to completion.

## Getting Started

Clone down the project to your own machine
  - In the root of the project create a folder called `config`
  - Inside that folder, create a new file and call it config.json
  - Put the following piece of code into the config.json file
  ```ruby
  {
	"SECRET": "followyourdreams"
  }
  ```

Run `$ npm install` to install dependencies  
Run `$ npm run start` to create server instance  
Run `$ npm run db:create` to create database  
Run `$ npm run db:schema` to set up tables  
Run `$ npm run db:seed-albums` to load album seed data  

Go to http://localhost:3000/
  - From the homepage, navigate to the **Register** link and sign up
  - **Head back to the command line and run** `$ npm run db:seed-reviews`
  - Head back to the homepage and **Login**
  - You are now able to navigate all around the site freely
  - Have opinions
  - Have fun :)


## Author:
  Spencer Dezart-Smith
