import React from 'react'
import { graphql } from 'gatsby'
import PropTypes from 'prop-types'
import PostPreview from '../components/post-preview'
import Layout from '../components/layout'
import { Container } from '../components/container/index.styles'

const BlogPage = ({ data }) => {
  const { edges: posts } = data.allMarkdownRemark
  return (
    <Layout>
      <Container>
        {posts.map(({ node: post }) => (
          <PostPreview key={post.id} post={post} />
        ))}
      </Container>
    </Layout>
  )
}

BlogPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            id: PropTypes.string.isRequired,
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
              readingTime: PropTypes.shape({
                minutes: PropTypes.number.isRequired,
                text: PropTypes.string.isRequired,
              }),
            }),
            frontmatter: PropTypes.shape({
              date: PropTypes.string.isRequired,
              title: PropTypes.string.isRequired,
              tags: PropTypes.arrayOf(PropTypes.string).isRequired,
              excerpt: PropTypes.string.isRequired,
            }),
          }),
        })
      ),
    }),
  }).isRequired,
}

export const query = graphql`
  query BlogQuery {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        fileAbsolutePath: { regex: "//src/posts/.*.md$/" }
        frontmatter: { hidden: { ne: true } }
      }
    ) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date
            tags
            excerpt
          }
          fields {
            slug
            readingTime {
              minutes
              text
            }
          }
        }
      }
    }
  }
`

export default BlogPage
