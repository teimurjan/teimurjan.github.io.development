import { keyframes } from '@emotion/core'
import styled from '@emotion/styled'
import { mediaSizeLessThan, sizes } from '../../media'

const bounceRight = keyframes`
  from {
    transform: translateX(0);
  }

  50% {
    transform: translateX(10px);
  }
  
  to {
    transform: translateX(0);
  }
`

const bounceLeft = keyframes`
  from {
    transform: translateX(0);
  }

  50% {
    transform: translateX(-10px);
  }
  
  to {
    transform: translateX(0);
  }
`

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

  .call-to-action {
    position: relative;

    &::before {
      content: '➡️';
      font-size: 2rem;
      display: block;
      position: absolute;
      left: 10vw;
      top: 50%;
      animation: ${bounceRight} 1s ease-in-out infinite;
    }

    &::after {
      content: '⬅️';
      font-size: 2rem;
      display: block;
      position: absolute;
      right: 10vw;
      top: 50%;
      animation: ${bounceLeft} 1s ease-in-out infinite;
    }

    @media ${mediaSizeLessThan(sizes.lg)} {
      &::before,
      &::after {
        display: none;
      }
    }
  }
`

export const MarkdownTitle = styled.h1`
  color: var(--primaryColor);
  margin: 0.5rem 0;
`
