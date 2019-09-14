require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  GOOGLE_TAG_MANAGER_ID: process.env.GATSBY_GOOGLE_TAG_MANAGER_ID,
  IS_ADMIN_BUILD: process.env.GATSBY_IS_ADMIN_BUILD === 'true',
  // URL is a predefined Netlify variable
  ADMIN_REDIRECT_URL: process.env.URL
}
