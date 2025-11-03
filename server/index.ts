import next from 'next';
import express from 'express';
import bodyParser from 'body-parser';
import { RequestData } from '../types/RequestData';
import { IdentityData } from '../types/IdentityData';
import { ResponseError } from '../types/ResponseError';
import saveAccessDataInCookie from './utils/saveAccessDataCookie';
import getAccessDataCookie from './utils/getAccessDataCookie';
import getOrders from './utils/getOrders';

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.NODE_PORT ? process.env.NODE_PORT : 3000;

const app = next({ dev });
const handle = app.getRequestHandler();
const Discogs = require('disconnect').Client;

const onAppHasBeenPrepared = () => {
  const server = express();

  server.use(bodyParser.json());

  server.get('/', (req, res) => {
    if (getAccessDataCookie(req)) {
      app.render(req, res, '/', {}).then();
    } else {
      res.redirect('authorize');
    }
  });

  server.get('/authorize', (_req, res) => {
    new Discogs()
      .oauth()
      .getRequestToken(
        process.env.DISCOGS_CONSUMER_KEY,
        process.env.DISCOGS_CONSUMER_SECRET,
        process.env.DISCOGS_CALLBACK_URL,
        (error: ResponseError, requestData: RequestData) => {
          if (error) {
            res.status(500).json({
              message: 'There was an error with your request.',
            });
          } else {
            server.set('requestData', requestData);
            res.redirect(requestData.authorizeUrl);
          }
        }
      );
  });

  server.get('/callback', (req, res) => {
    const requestData = server.get('requestData');
    const oAuthVerifier = req.query.oauth_verifier;

    new Discogs(requestData)
      .oauth()
      .getAccessToken(oAuthVerifier, function (error: ResponseError, accessData: RequestData) {
        if (error) {
          res
            .json({
              message: 'There was an error with your request.',
            })
            .status(500);
        } else {
          saveAccessDataInCookie(res, accessData);
          res.redirect('/');
        }
      });
  });

  server.get('/orders', (req, res) => {
    const accessData = getAccessDataCookie(req);

    if (!accessData) {
      res.status(401).json({ hasAuthError: true });
      return;
    }

    new Discogs(accessData).getIdentity(async function (
      error: ResponseError,
      identityData: IdentityData
    ) {
      if (error) {
        res.json({ hasAuthError: true }).status(error.statusCode ?? 500);
      } else {
        const orders = await getOrders(accessData);

        res.json({ orders: { ...orders, username: identityData.username } }).status(200);
      }
    });
  });

  // handle all other routes with Next.js
  server.all(/(.*)/, (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => console.log('> Ready on http://localhost:' + port));
};

const onAppPreparationFailed = (error: Error) => {
  console.error(error.stack);
  process.exit(1);
};

app.prepare().then(onAppHasBeenPrepared).catch(onAppPreparationFailed);
