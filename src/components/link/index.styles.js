import styled from '@emotion/styled'
import { Link } from 'gatsby'

export const PrimaryLink = styled(Link)`
  text-decoration: none;
  color: var(--primaryColor);

  &:hover {
    color: var(--primaryLightColor);
  }
`

export const PrimaryALink = PrimaryLink.withComponent('a')
