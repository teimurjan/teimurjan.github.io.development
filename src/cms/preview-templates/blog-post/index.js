import React from 'react'
import PropTypes from 'prop-types'
import BlogPostTemplate from '../../../templates/blog-post'

const BlogPostPreview = ({ entry, widgetFor }) => (
  <BlogPostTemplate
    content={widgetFor('body')}
    pageContext={{
      post: {
        frontmatter: {
          title: entry.getIn(['data', 'title']),
          tags: entry.getIn(['data', 'tags']),
          date: entry.getIn(['data', 'date']),
        },
      },
    }}
  />
)

BlogPostPreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default BlogPostPreview
