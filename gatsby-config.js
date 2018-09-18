module.exports = {
  siteMetadata: {
    title: 'Pizza Club',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-transformer-json',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: './_data/',
      },
    },
  ],
}
