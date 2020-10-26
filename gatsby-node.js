/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require('path')
const _ = require('lodash')
const { createFilePath } = require('gatsby-source-filesystem')

exports.createPages = async ({ actions, graphql }) => {
  const posts = await createPosts({ actions, graphql })
  createAllTags({ actions })
  createTags({ actions, posts })
}

const createPosts = async ({ actions, graphql }) => {
  const { createPage } = actions

  const result = await graphql(`
    query {
      allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        filter: { fileAbsolutePath: { regex: "//src/posts/.*.md$/" } }
      ) {
        edges {
          node {
            fileAbsolutePath
            html
            id
            fields {
              slug
            }
            frontmatter {
              excerpt
              date(formatString: "MMM DD, YYYY")
              title
              tags
              canonical_url
            }
          }
        }
      }
    }
  `)

  const BlogPostTemplate = path.resolve('src/templates/blog-post/index.js')
  const posts = result.data.allMarkdownRemark.edges
  posts.forEach(({ node }) => {
    createPage({
      path: `/blog${node.fields.slug}`,
      component: BlogPostTemplate,
      context: {
        post: node
      }
    })
  })

  return posts
}

const createAllTags = ({ actions }) => {
  const { createPage } = actions

  const AllTagsTemplate = path.resolve('src/templates/tags/index.js')
  createPage({
    path: '/blog/tags',
    component: AllTagsTemplate
  })
}

const createTags = ({ actions, posts }) => {
  const { createPage } = actions

  const TagTemplate = path.resolve('src/templates/tag-results/index.js')
  const tags = getTagsFromPosts(posts)
  tags.forEach(tag => {
    createPage({
      path: `/blog/tags/${_.kebabCase(tag)}`,
      component: TagTemplate,
      context: {
        tag
      }
    })
  })
}

const getTagsFromPosts = posts =>
  _.uniq(
    posts.reduce((allTags, { node }) => {
      if (node.frontmatter.tags) {
        return [...allTags, ...node.frontmatter.tags]
      }
      return allTags
    }, [])
  )

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === 'MarkdownRemark') {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: 'slug',
      node,
      value
    })
  }
}
