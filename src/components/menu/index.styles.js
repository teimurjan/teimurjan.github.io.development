import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { PrimaryLink, PrimaryALink } from '../link/index.styles'
import { mediaSizeLessThan, mediaSizeGreaterThan, sizes } from '../../media'

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

  @media ${mediaSizeGreaterThan(sizes.md)} {
    display: none;
  }
`

const MenuIconSquare = styled.div`
  position: absolute;
  height: ${menuIconSquareSize}px;
  width: ${menuIconSquareSize}px;
  background: var(--primaryColor);
  transition: all 0.3s;
`

export const MenuIconSquare1 = styled(MenuIconSquare)`
  left: 0;
  top: 0;

  ${MenuIcon} [data-open="true"] & {
    transform: translate(-50%, -50%);
  }
`

export const MenuIconSquare2 = styled(MenuIconSquare)`
  right: 0;
  top: 0;

  ${MenuIcon} [data-open="true"] & {
    transform: translate(50%, -50%);
  }
`

export const MenuIconSquare3 = styled(MenuIconSquare)`
  left: 0;
  bottom: 0;

  ${MenuIcon} [data-open="true"] & {
    transform: translate(-50%, 50%);
  }
`

export const MenuIconSquare4 = styled(MenuIconSquare)`
  right: 0;
  bottom: 0;

  ${MenuIcon} [data-open="true"] & {
    transform: translate(50%, 50%);
  }
`

export const MenuDropdown = styled.div`
  display: flex;
  align-items: center;

  @media ${mediaSizeLessThan(sizes.md)} {
    margin-left: 0;
    right: 0;
    transition: transform 350ms ease-in-out;
    transform-origin: top right;
    transform: scale(0);
    position: absolute;
    flex-direction: column;
    background: var(--lightBackgroundColor);
    top: 50px;
    border-radius: 20px;
    padding: 10px;
    width: 500px;
    max-width: calc(100vw - 50px);

    &[data-open='true'] {
      transform: scale(1);
    }
  }
`

const menuItemCSS = css`
  padding-left: 50px;
  border-radius: 16px;
  cursor: pointer;
  color: var(--primaryColor);
  font-weight: bold;
  text-transform: uppercase;

  &:hover {
    background: var(--backgroundColor);
  }

  @media ${mediaSizeLessThan(sizes.md)} {
    color: var(--fontOnLightBackgroundColor);
    padding: 10px;
    width: 100%;
  }
`

export const MenuItem = styled.div`
  ${menuItemCSS}
`
export const MenuItemLink = styled(PrimaryLink)`
  ${menuItemCSS}
`

export const MenuItemA = styled(PrimaryALink)`
  ${menuItemCSS}
`

export const MenuItemFlex = styled(MenuItem)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const ToggleThemeLabel = styled.span`
  margin-right: 15px;

  &:after {
    content: 'Mode';
  }

  @media ${mediaSizeLessThan(sizes.md)} {
    &:after {
      content: 'Mode';
    }
  }
`
