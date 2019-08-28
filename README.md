# discogs-visualizer

App to visualize different data from [Discogs](https://www.discogs.com) marketplace. Currently it shows only your sells. It is using [disconnect](https://github.com/bartve/disconnect), a Node.js client with OAuth for the connection to Discogs.

## Architecture

The front end and backend are currently in the same repository. This may change later.

### Front End

The front end application is build with [jQuery](https://jquery.com/) and Highstock from [Highcharts](https://www.highcharts.com).

### Back End

The back end is build for Google App Engine in [Node.js](https://nodejs.org). For the database the application is using [Google Cloud Datastore](https://cloud.google.com/datastore/docs/concepts/overview) to simply store login credentials from discogs. You need a google account and connection to google app engine and datastore to use the application like it is. The main data comes directly from discogs. It may be changed in the future -> cron job caching in datastore.

## Local Development

For local development you need to install npm dependencies and run the node application.

We use [`npm`](https://www.npmjs.com) for front end dependency management.

```bash
$ npm install
...
$ node server.js
```
Aftwards you can just start the application in your browser with localhost:8080
