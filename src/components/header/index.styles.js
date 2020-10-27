import styled from '@emotion/styled'
import { Link } from 'gatsby'
import { mediaSizeLessThan, sizes } from '../../media'
import { Container } from '../container/index.styles'

export const HeaderWrapper = styled.div`
  position: fixed;
  width: 100%;
  z-index: 2;
  background: var(--backgroundColor);
  top: 0;
  height: 60px;

  @media ${mediaSizeLessThan(sizes.md)} {
    height: 50px;
  }

  ${Container} {
    height: 100%;
  }
`

export const HeaderInner = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: space-between;
`

export const HeaderTitle = styled.h2`
  margin: -2.5px 0 0 0;
  font-size: 1.8rem;
  @media ${mediaSizeLessThan(sizes.sm)} {
    font-size: 1.4rem;
  }
`

export const HeaderLink = styled(Link)`
  color: var(--primaryColor);
  text-decoration: none;
`
