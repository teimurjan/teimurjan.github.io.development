import styled from '@emotion/styled'
import { mediaSizeLessThan, sizes, mediaSizeGreaterThan } from '../../media'
import { DateThumbnail } from '../../components/post-preview/index.styles'

export const BlogPostContent = styled.div`
  font-size: 1rem;
  line-height: 1.5;

  h2 {
    &:before {
      color: var(--primaryColor);
    }
  }

  p,
  h2 {
    margin-bottom: 1rem;
  }

  a {
    color: var(--primaryColor);
  }

  @media ${mediaSizeGreaterThan(sizes.xl)} {
    font-size: 1.1rem;
  }
`

export const BlogPostTitle = styled.h1`
  color: var(--fontOnBackgroundColor);
  margin: 1rem 0;
  width: 80%;
`

export const BlogPostHeader = styled.div`
  position: relative;
`

export const BlogPostDateThumbnail = styled(DateThumbnail)`
  top: 0;

  @media ${mediaSizeLessThan(sizes.md)} {
    right: 0;
  }
`

export const BlogPostDivider = styled.hr`
  margin: 1rem 0;
`
