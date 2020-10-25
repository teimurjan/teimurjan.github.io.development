import React from 'react'
import format from 'date-fns/format'
import distanceInWords from 'date-fns/distance_in_words'
import PropTypes from 'prop-types'
import {
  PostPreviewExcerpt,
  PostPreviewFooter,
  PostPreviewInfo,
  PostPreviewTitle,
  PostPreviewWrapper,
  DateThumbnail,
  DateThumbnailDay,
  DateThumbnailMonth,
  LevelOverlay
} from './index.styles'
import { Link } from 'gatsby'

const PostPreview = ({
  post: {
    frontmatter,
    fields: { readingTime, slug }
  },
  shouldHide
}) => {
  const date = new Date(frontmatter.date)
  return (
    <PostPreviewWrapper as={Link} to={`/blog${slug}`} hide={shouldHide}>
      <LevelOverlay>
        {'🍩'.repeat(Math.ceil(readingTime.minutes / 5))} {readingTime.text}
      </LevelOverlay>
      <DateThumbnail>
        <DateThumbnailDay>{date.getDate()}</DateThumbnailDay>
        <DateThumbnailMonth>{format(date, 'MMM')}</DateThumbnailMonth>
      </DateThumbnail>
      <PostPreviewInfo>
        <PostPreviewTitle>{frontmatter.title}</PostPreviewTitle>
        <PostPreviewExcerpt>{frontmatter.excerpt}</PostPreviewExcerpt>
        <PostPreviewFooter>
          <i className="far fa-clock" /> {distanceInWords(new Date(), date)}{' '}
          ago.{' '}
        </PostPreviewFooter>
      </PostPreviewInfo>
    </PostPreviewWrapper>
  )
}

PostPreview.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fields: PropTypes.shape({
      slug: PropTypes.string.isRequired,
      readingTime: PropTypes.shape({
        minutes: PropTypes.number.isRequired,
        text: PropTypes.string.isRequired
      })
    }),
    frontmatter: PropTypes.shape({
      date: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string).isRequired,
      slug: PropTypes.string.isRequired,
      excerpt: PropTypes.string.isRequired
    })
  }),
  shouldHide: PropTypes.bool
}

export default PostPreview
