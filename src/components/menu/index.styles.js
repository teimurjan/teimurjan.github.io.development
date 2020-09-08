import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { PrimaryLink, PrimaryALink } from '../link/index.styles'
import { mediaSizeLessThan, sizes } from '../../media'

export const MenuWrapper = styled.div`
  position: relative;
`

const menuIconSquareSize = 8
const menuIconSquareSpacing = 4

export const MenuIcon = styled.div`
  position: relative;
  width: ${menuIconSquareSize * 2 + menuIconSquareSpacing}px;
  height: ${menuIconSquareSize * 2 + menuIconSquareSpacing}px;
  cursor: pointer;

  &:focus {
    outline: 0;
    outline-color: transparent;
    outline-style: none;
  }
`

const _MenuIconSquare = styled.div`
  position: absolute;
  height: ${menuIconSquareSize}px;
  width: ${menuIconSquareSize}px;
  background: var(--primaryColor);
  transition: all 0.3s;
`

export const MenuIconSquare1 = styled(_MenuIconSquare)`
  left: 0;
  top: 0;

  ${MenuIcon}:hover &, ${MenuIcon}[data-open="true"] & {
    transform: translate(-50%, -50%);
  }
`

export const MenuIconSquare2 = styled(_MenuIconSquare)`
  right: 0;
  top: 0;

  ${MenuIcon}:hover &, ${MenuIcon}[data-open="true"] & {
    transform: translate(50%, -50%);
  }
`

export const MenuIconSquare3 = styled(_MenuIconSquare)`
  left: 0;
  bottom: 0;

  ${MenuIcon}:hover &, ${MenuIcon}[data-open="true"] & {
    transform: translate(-50%, 50%);
  }
`

export const MenuIconSquare4 = styled(_MenuIconSquare)`
  right: 0;
  bottom: 0;

  ${MenuIcon}:hover &, ${MenuIcon}[data-open="true"] & {
    transform: translate(50%, 50%);
  }
`

export const MenuDropdown = styled.div`
  align-items: center;
  display: flex;
  transition: transform 350ms ease-in-out;
  transform-origin: top right;
  transform: scale(0);
  position: absolute;
  flex-direction: column;
  background: var(--lightBackgroundColor);
  top: 50px;
  border-radius: 20px;
  padding: 10px;
  max-width: 100%;
  width: 500px;
  max-width: 100vw;
  right: 0;

  &[data-open='true'] {
    transform: scale(1);
  }
`

const menuItemCSS = css`
  padding: 10px;
  width: 100%;
`

const menuItemLinkCSS = css`
  ${menuItemCSS}
  border-radius: 16px;

  &:hover {
    background: var(--backgroundColor);
  }
`

export const MenuItem = styled.div`
  ${menuItemCSS}
`
export const MenuItemLink = styled(PrimaryLink)`
  ${menuItemLinkCSS}
`

export const MenuItemA = styled(PrimaryALink)`
  ${menuItemLinkCSS}
`
