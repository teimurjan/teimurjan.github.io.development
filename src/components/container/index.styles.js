import styled from '@emotion/styled'
import { mediaSizeLessThan, sizes } from '../../media'

export const Container = styled.div`
  margin: 0 auto;
  padding-left: 70px;
  padding-right: 70px;
  max-width: 1292px;

  @media ${mediaSizeLessThan(sizes.md)} {
    padding-left: 25px;
    padding-right: 25px;
    max-width: 1252px;
  }
`
