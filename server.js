const express = require('express');
const {Datastore} = require('@google-cloud/datastore');
const Discogs = require('disconnect').Client;
const bodyParser = require('body-parser');

const isProduction = process.env.NODE_ENV = process.env.NODE_ENV == 'production';
const tokenParams = {
  consumerKey: process.env.DISCOGS_CONSUMER_KEY,
  consumerSecret: process.env.DISCOGS_CONSUMER_SECRET,
  appUrl: isProduction ? process.env.DISCOGS_APP_URL : 'http://localhost:8080'
};

const app = express();
const datastore = new Datastore();
const kind = 'googleAuth';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  const query = datastore.createQuery(kind).filter('user', isProduction ? req.headers['x-goog-authenticated-user-id'] : 'development');
  datastore.runQuery(query, function(err, entities) {
    if(entities.length) {
      res.render('index');
    } else {
      res.redirect('/authorize');
    }
  });
});

app.get('/authorize', function(req, res){
  var oAuth = new Discogs().oauth();
  oAuth.getRequestToken(
    tokenParams.consumerKey,
    tokenParams.consumerSecret,
    tokenParams.appUrl + '/callback',
    function(err, requestData){
      app.set('requestData', requestData);
      res.redirect(requestData.authorizeUrl);
    }
  );
});

app.get('/callback', function(req, res){
  var requestData = app.get('requestData');
  var oAuth = new Discogs(requestData).oauth();
  oAuth.getAccessToken(
    req.query.oauth_verifier,
    function(err, accessData){
      updateDatastoreAndRedirect(accessData, req, res);
    }
  );
});

app.get('/orders', function(req, res){
  const query = datastore.createQuery(kind).filter('user', isProduction ? req.headers['x-goog-authenticated-user-id'] : 'development');
  datastore.runQuery(query, function(err, entities) {
    if(entities.length) {
      const accessData = entities[0].accessData;

      new Discogs(accessData).getIdentity(function(err, identityData){
        if(err){
          res.send({
            error: err
          });
        } else {
          var marketplace = new Discogs(accessData).marketplace();
          var summary = {};

          marketplace.getOrders({ per_page: 50 }).then(async function(order){
            var series = [];
            var itemsSold = 0;
            var totalAmount = 0;
            var ordersTotal = 0;
            var ordersCancelled = 0;
            var series_items = [];
            var ordersRefund = 0;

            for(var i = 0; i < order.pagination.pages; i++){
              await marketplace.getOrders({ per_page: 50, page: i + 1 }).then(function(order){
                order.orders.forEach(function(element){
                  ordersTotal++;
                  if(['Shipped', 'New Order', 'Invoice Sent', 'Payment Pending', 'Payment Received', 'Order Changed'].includes(element.status)){
                    var timestamp = new Date(element.created).getTime();
                    var profit = element.total.value - element.fee.value;
                    itemsSold += element.items.length;
                    totalAmount += profit;
                    series.push([timestamp, profit]);
                    series_items.push({
                      id: element.id,
                      created: new Date(element.created).getTime(),
                      resource_url: element.resource_url,
                      total: element.total.value,
                      fee: element.fee.value,
                      items: element.items
                    });
                  } else if (element.status.includes('Cancelled')) {
                    ordersCancelled++;
                  } else if (element.status.includes('Refund Sent')) {
                    ordersRefund++;
                  }
                });
              });
            }

            res.send({
              series: series,
              series_items: series_items,
              summary: summary,
              meta: {
                username: identityData.username,
                ordersTotal: ordersTotal,
                ordersSent: series.length,
                ordersCancelled: ordersCancelled,
                ordersRefund: ordersRefund,
                itemsSold: itemsSold,
                totalAmount: totalAmount
              }
            });
          });
        }
      });
    }
  });
});

// app.get('/identity', function(req, res){
//   const query = datastore.createQuery(kind).filter('user', isProduction ? req.headers['x-goog-authenticated-user-id'] : 'development');
//   datastore.runQuery(query, function(err, entities) {
//     if(entities.length) {
//       new Discogs(entities[0].accessData).getIdentity(function(err, data){
//         res.send(data);
//       });
//     }
//   });
// });

function updateDatastoreAndRedirect(data, req, res) {
  var userdata = {};

  const query = datastore.createQuery(kind).filter('user', isProduction ? req.headers['x-goog-authenticated-user-id'] : 'development');
  datastore.runQuery(query, async function(err, entities) {
    userdata.data = {
      user: isProduction ? req.headers['x-goog-authenticated-user-id'] : 'development',
      accessData: data
    };
    // UPDATE
    if(entities.length) {
      const firstEntityKey = entities[0][datastore.KEY];
      userdata.key = datastore.key(['googleAuth', Number(firstEntityKey.id)]);
    // NEW
    } else {
      userdata.key = datastore.key(kind);
    }

    await datastore.save(userdata);

    res.redirect('/');
  });
};

app.listen(8080, function () {
  console.log('Discogs Visualizer app listening on port 8080!');
});