const express = require('express');
const cors = require('cors');
const log = require('log4js');
const { exec } = require('child_process');

const measureTemp = () =>
  new Promise((res, rej) => {
    exec('/opt/vc/bin/vcgencmd measure_temp', (err, stdout) => {
      if (err) {
        return rej(err);
      }
      return res(stdout);
    });
  });

log.configure({
  appenders: {
    console: { type: 'console' },
  },
  categories: { default: { appenders: ['console'], level: 'trace' } },
});

const appLogger = log.getLogger('app');

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

app.get('/temp', (req, res, next) => {
  measureTemp()
    .then(stdout =>
      res.status(200).json({
        temp: parseFloat(stdout.split('=')[1].split('\'')[0]),
      }),
    )
    .catch(err => next(err));
});


appLogger.info('starting server...');
app.listen(8080, '0.0.0.0', () => {
  appLogger.info('server is listening');
});
