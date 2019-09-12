import React from 'react'
import PropTypes from 'prop-types'

import { BlogPost } from '../../../templates/blog-post'

const BlogPostPreview = ({ entry, widgetFor }) => (
  <BlogPost
    content={<BlogPostContent>{widgetFor('body')}</BlogPostContent>}
    title={entry.getIn(['data', 'title'])}
    tags={entry.getIn(['data', 'tags'])}
    date={new Date(entry.getIn(['data', 'date']))}
  />
)

BlogPostPreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default BlogPostPreview
