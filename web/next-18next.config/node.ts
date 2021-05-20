//@ts-ignore
module.exports = require('./index.ts');

const ChainedBackend = require('i18next-chained-backend');
const FSBackend = require('i18next-fs-backend/cjs');
const HttpBackend = require('i18next-http-backend/cjs');

//@ts-ignore
module.exports.backend = {
  backends: [FSBackend, HttpBackend],
  backendOptions: [
    {
      loadPath: './public/locales_cache/{{lng}}/{{ns}}.json',
      addPath: './public/locales_cache/{{lng}}/{{ns}}.json',
      expirationTime: 60 * 60 * 1000,
    },
    module.exports.backend,
  ],
};

//@ts-ignore
module.exports.use = [ChainedBackend];
