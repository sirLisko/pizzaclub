import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import Header from '../components/header'
import './index.css'

const Layout = ({ children, data }) => (
  <div>
    <Helmet
      title={data.site.siteMetadata.title}
      meta={[
        { name: 'author', content: 'Luca Lischetti' },
        {
          name: 'description',
          content:
            "sirLisko's tasty Pizza Adventure by reviewing the best Pizza around the Globe.",
        },
        { name: 'keywords', content: 'Pizza, Pizzeria, Pizza Club' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, maximum-scale=1',
        },
      ]}
      link={[
        {
          href: 'http://fonts.googleapis.com/css?family=Oswald|Open+Sans',
          rel: 'stylesheet',
          type: 'text/css',
        },
      ]}
    />
    <h1>Pizza Club</h1>
    <p>My tasty Pizza Adventure around the World.</p>
    {children()}
  </div>
)

Layout.propTypes = {
  children: PropTypes.func,
}

export default Layout

export const query = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
