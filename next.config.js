module.exports = {
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  publicRuntimeConfig: {
    fathomDomain: process.env.FATHOM_DOMAIN,
    fathomId: process.env.FATHOM_ID,
  },
};
