import styled from '@emotion/styled'
import { keyframes } from '@emotion/core'
import GatsbyImage from 'gatsby-image'
import SkillCard from '../components/skill-card'
import { mediaSizeLessThan, sizes } from '../media'

export const IndexPageWrapper = styled.div`
  padding-top: 20px;

  @media ${mediaSizeLessThan(sizes.md)} {
    padding-top: 10px;
  }
`
export const IndexPageColumnsWrapper = styled(IndexPageWrapper)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media ${mediaSizeLessThan(sizes.md)} {
    flex-direction: column-reverse;
  }
`

export const IndexPageImage = styled(GatsbyImage)`
  flex: 0.45;
  position: relative;

  &::after {
    position: absolute;
    content: '';
    height: 30px;
    width: 100%;
    bottom: 0;
    background: linear-gradient(transparent 0%, var(--backgroundColor) 100%);
  }

  @media ${mediaSizeLessThan(sizes.md)} {
    width: 100%;
    flex: 1;
  }
`

export const IndexPageTitle = styled.h1`
  font-family: 'Bungee', cursive;
  color: var(--primaryColor);
  font-size: 3rem;
  text-transform: uppercase;
  margin-bottom: 10px;
`

export const IndexPageSubTitle = styled.h2`
  color: var(--fontOnBackgroundColor);
  font-size: 1.75rem;
`

export const IndexPageContentContainer = styled.div`
  flex: 0.5;
  @media ${mediaSizeLessThan(sizes.md)} {
    padding-top: 20px;
  }
`

export const IndexPageCardsContainer = styled.div`
  & > * {
    margin-bottom: 15px;
  }
`

const fadeInFromLeft = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
`
export const IndexPageAnimatedSkillCard = styled(SkillCard)`
  transform: translateX(-100%);
  opacity: 0;

  animation: ${fadeInFromLeft} 400ms ease forwards;
  animation-delay: ${props => props.delay}ms;
`

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`
export const IndexPageAnimatedContent = styled.div`
  opacity: 0;

  animation: ${fadeIn} 400ms ease forwards;
  animation-delay: ${props => props.delay}ms;
`

export const IndexPageDescriptionContainer = styled.div`
  padding-top: 20px;
`

export const IndexPageDescription = styled.p`
  color: var(--fontOnBackgroundColor);
`
