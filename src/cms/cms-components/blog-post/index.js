import React from 'react'
import PropTypes from 'prop-types'
import format from 'date-fns/format'

import CMSContainer from '../cms-container'

import './index.css'

export const BlogPost = ({ tags, date, title, content }) => (
  <CMSContainer>
    <div className="blog-post-header">
      <h1 className="blog-post-title">{title}</h1>
      <div className="blog-post-date">
        <div className="blog-post-date day">{date.getDate()}</div>
        <div className="blog-post-date month">{format(date, 'MMM')}</div>
      </div>
      <div className="blog-post-tags">
        {tags.map(tag => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </div>
    <div className="blog-post-divider" />
    <div className="blog-post-content">{content}</div>
  </CMSContainer>
)

BlogPost.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired
}

export default BlogPost
