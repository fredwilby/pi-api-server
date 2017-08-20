const express = require('express');
const cors = require('cors');
const log = require('log4js');
const fs = require('fs');

const handleError = require('./handleError');

const appLogger = log.getLogger('app');

log.configure({
  appenders: {
    console: { type: 'console' },
  },
  categories: { default: { appenders: ['console'], level: 'trace' } },
});

const measureTemp = () =>
  new Promise((res, rej) => {
    fs.readFile('/data/temp', 'utf8', (err, data) => {
      if (err) { return rej(err); }
      appLogger.info(data);
      return res(`${Number(data) / 1000} deg C`);
    });
  });

const app = express();
app.use('/health', (req, res) => res.status(200).send());
app.use(cors({
  origin: 'pi.fredwilby.com',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization,X-Requested-With,cookie,origin,accept',
  credentials: true,
}));

// configure our app to handle CORS requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'pi.fredwilby.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization, cookie, origin, accept');
  next();
});

app.options('*', cors());

app.set('trust proxy', 1);

app.use(log.connectLogger(log.getLogger('http'), { level: 'auto' }));

app.get('/api/temp', (req, res, next) => {
  appLogger.info('getting temp...');
  measureTemp()
    .then(temp => res.status(200).json({ temp }))
    .catch(err => next(err));
});

app.use(handleError(appLogger));

appLogger.info('starting server...');
app.listen(8080, '0.0.0.0', () => {
  appLogger.info('server is listening');
});
