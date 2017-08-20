module.exports = logger =>
  (err, req, res, next) => { // eslint-disable-line no-unused-vars
    const status = (err && err.status) || 500;
    const message = (err && err.message) || 'unspecified error';

    logger.error(`${message}\t${status}`);
    logger.log(err && err.stack);

    return res.status(status).json({
      message,
      status,
    });
  };
