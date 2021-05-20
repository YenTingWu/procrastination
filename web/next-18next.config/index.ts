/**
 * 1. Internationalized
 *
 *    Setting up next-i18n
 *
 * 2. Navigate between different locale pages
 *
 *    Besides the default locale page, it has to allow users go to other locale pages
 *
 * 3. Cache users' option
 *
 *    Using NEXT_LOCALE cookie to set the locale option
 */

//@ts-ignore
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-TW'],
    serializeConfig: false,
  },
  backend: {
    reference: 'en',
  },

  use: [require('i18next-http-backend')],
  ns: ['common'],
  serializeConfig: false,
};
