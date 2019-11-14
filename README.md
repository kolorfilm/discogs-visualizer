# discogs-visualizer

![alt Example Image](public/images/screenshots/example.png)

App to visualize different data from [Discogs](https://www.discogs.com) marketplace. Currently it shows only your sells. It uses [disconnect](https://github.com/bartve/disconnect), a Node.js client with OAuth for the connection to the [Discogs API](https://www.discogs.com/developers).

## Front End

The front end application is build with [jQuery](https://jquery.com/) and Highstock from [Highcharts](https://www.highcharts.com).

## Back End

The back end is build for Google App Engine in [Node.js](https://nodejs.org). For the database the application is using [Google Cloud Datastore](https://cloud.google.com/datastore/docs/concepts/overview) to simply store login credentials from discogs. You need a google account and connection to google app engine and datastore to use the application like it is. The main data comes directly from discogs. It may be changed in the future -> cron job caching in datastore.

## Local Development

For local development you need to install npm dependencies and run the node application. You also need to create an application on the [Discogs Developer Settings Page](https://www.discogs.com/settings/developers) after you logged in. You need to store the generated consumer key and secret in your [.bash_profile](https://scriptingosx.com/2017/04/about-bash_profile-and-bashrc-on-macos) file in your home directory on your mac.

[`npm`](https://www.npmjs.com) is used for front end dependency management.

```bash
$ npm install
...
$ node server.js
```

Afterwards you can just start the application in your browser with localhost:8080
