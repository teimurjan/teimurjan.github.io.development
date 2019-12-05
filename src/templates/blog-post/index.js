import React from 'react'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'
import format from 'date-fns/format'
import Layout from '../../components/layout'
import Tags from '../../components/tags'
import {
  BlogPostContent,
  BlogPostTitle,
  BlogPostHeader,
  BlogPostDateThumbnail,
  BlogPostDivider,
} from './index.styles'
import { Container } from '../../components/container/index.styles'
import {
  DateThumbnailDay,
  DateThumbnailMonth,
} from '../../components/post-preview/index.styles'

export const BlogPost = ({ tags, date, title, content }) => (
  <Container>
    <BlogPostHeader>
      <BlogPostTitle>{title}</BlogPostTitle>
      <BlogPostDateThumbnail>
        <DateThumbnailDay>{date.getDate()}</DateThumbnailDay>
        <DateThumbnailMonth>{format(date, 'MMM')}</DateThumbnailMonth>
      </BlogPostDateThumbnail>
      <Tags tags={tags} />
    </BlogPostHeader>
    <BlogPostDivider />
    {content}
  </Container>
)

BlogPost.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
}

const BlogPostTemplate = ({
  pageContext: {
    post: { frontmatter, html },
  },
  content,
}) => {
  const date = new Date(frontmatter.date)

  return (
    <Layout>
      <Helmet
        title={frontmatter.title}
        link={
          frontmatter.canonical_url
            ? [
                {
                  rel: 'canonical',
                  key: frontmatter.canonical_url,
                  href: frontmatter.canonical_url,
                },
              ]
            : []
        }
      />
      <BlogPost
        title={frontmatter.title}
        date={date}
        content={<BlogPostContent dangerouslySetInnerHTML={{ __html: html }} />}
        tags={frontmatter.tags}
      />
      {frontmatter.canonical_url && (
        <>
          <BlogPostDivider />
          <i>
            Originally published at{' '}
            <a href={rel.canonical_url}>
              {new URL(rel.canonical_url).hostname}
            </a>
          </i>
        </>
      )}
    </Layout>
  )
}

BlogPostTemplate.propTypes = {
  content: PropTypes.node,
  contentComponent: PropTypes.func,
  pageContext: PropTypes.shape({
    post: PropTypes.shape({
      frontmatter: PropTypes.shape({
        date: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        tags: PropTypes.arrayOf(PropTypes.string).isRequired,
      }),
    }),
  }).isRequired,
}

export default BlogPostTemplate
