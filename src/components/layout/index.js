import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

import Header from '../header'
import Footer from '../footer'

import { LayoutWrapper, LayoutContent } from './index.styles'

import favicon from '../../../favicon.ico'

import './index.css'
import './index.override.css'

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query LayoutQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <LayoutWrapper>
        <Helmet
          title={data.site.siteMetadata.title}
          link={[
            {
              rel: 'icon',
              href: `${favicon}`
            }
          ]}
        />
        <Header siteTitle={data.site.siteMetadata.title} />
        <LayoutContent>{children}</LayoutContent>
        <Footer />
      </LayoutWrapper>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node
}

export default Layout
