import React from 'react'
import PropTypes from 'prop-types'
import {
  HeaderWrapper,
  HeaderInner,
  HeaderTitle,
  HeaderLink
} from './index.styles'
import { Container } from '../container/index.styles'
import { Menu } from '../menu'
import {
  MenuItemLink,
  MenuItemA,
  MenuItemFlex,
  ToggleThemeLabel
} from '../menu/index.styles'
import ThemeSwitcher from '../theme-switcher'
import { useTheme } from '../../theme'

const SHOW_THEME_TOGGLE = true

const Header = () => {
  // eslint-disable-next-line no-unused-vars
  const [_, toggleTheme] = useTheme()

  return (
    <HeaderWrapper>
      <Container>
        <HeaderInner>
          <HeaderTitle>
            <HeaderLink to="/">Home</HeaderLink>
          </HeaderTitle>
          <Menu>
            <MenuItemLink to="/blog">Blog</MenuItemLink>
            <MenuItemA target="_blank" href="/cv.pdf">
              Resume
            </MenuItemA>
            {SHOW_THEME_TOGGLE && (
              <MenuItemFlex data-no-close-on-click={true} onClick={toggleTheme}>
                <ToggleThemeLabel />
                <ThemeSwitcher />
              </MenuItemFlex>
            )}
          </Menu>
        </HeaderInner>
      </Container>
    </HeaderWrapper>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string.isRequired
}

export default Header
