RESOURCR. - Pinterest for learners
=========

## Features

### Users are able to: 
  * Save an external URL along with a title and description
  * Search for already-saved resources created by any user
  * Categorize any resource under a topic
  * Comment on any resource
  * Rate any resource
  * Like any resource
  * View all their own and all liked resources on one page ("My resources")
  * Update their profile

## Check out this GIF for a quick demo

!["RESOURCR.GIF"](https://github.com/zMollaz/RESOURCR./blob/master/docs/RESOURCRGIF.gif?raw=true)
## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information 
  - username: `labber` 
  - password: `labber` 
  - database: `midterm`
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Reset database: `npm run db:reset`
  - Check the db folder to see what gets created and seeded in the SDB
7. Run the server: `npm run local`
  - Note: nodemon is used, so you should not have to restart your server
8. Visit `http://localhost:8080/`

## Dependencies

- Node 10.x or above
- NPM 5.x or above
- PG 6.x
