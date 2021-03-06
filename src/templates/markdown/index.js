import React from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'
import Layout from '../../components/layout'
import { Container } from '../../components/container/index.styles'
import { MarkdownTitle, MarkdownContent } from './index.styles'

const MarkdownPage = ({ pageContext }) => {
  const { markdownRemark, site } = pageContext
  const { frontmatter, html } = markdownRemark
  const {
    siteMetadata: { title: siteTitle }
  } = site

  const title =
    frontmatter.title && frontmatter.title.length > 0
      ? frontmatter.title
      : undefined
  return (
    <Layout>
      {title && <Helmet title={`${siteTitle} - ${title}`} />}
      <Container>
        {title && <MarkdownTitle>{title}</MarkdownTitle>}
        <MarkdownContent dangerouslySetInnerHTML={{ __html: html }} />
      </Container>
    </Layout>
  )
}

MarkdownPage.propTypes = {
  pageContext: PropTypes.shape({
    markdownRemark: PropTypes.string,
    site: PropTypes.shape({ siteMetadata: { title: PropTypes.string } })
  }),
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.shape({
        title: PropTypes.string.isRequired
      }),
      html: PropTypes.string.isRequired
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired
      })
    })
  }).isRequired
}

export default MarkdownPage
