import styled from '@emotion/styled'

export const MarkdownContent = styled.div`
  h1,
  h2 {
    color: var(--primaryColor);
  }

  p,
  h2,
  h3,
  h4 {
    margin-bottom: 1rem;
  }

  a {
    color: var(--primaryColor);
    text-decoration: underline;
  }
`

export const MarkdownTitle = styled.h1`
  color: var(--primaryColor);
  margin: 0.5rem 0;
`
