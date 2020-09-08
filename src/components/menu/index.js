import React from 'react'
import PropTypes from 'prop-types'
import {
  MenuWrapper,
  MenuIcon,
  MenuDropdown,
  MenuIconSquare1,
  MenuIconSquare2,
  MenuIconSquare3,
  MenuIconSquare4,
} from './index.styles'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { Container } from '../container/index.styles'

const MenuHamburger = React.forwardRef(({ isOpen, ...props }, ref) => (
  <MenuIcon ref={ref} data-open={isOpen} {...props}>
    <MenuIconSquare1 />
    <MenuIconSquare2 />
    <MenuIconSquare3 />
    <MenuIconSquare4 />
  </MenuIcon>
))

export const Menu = ({ children }) => {
  const dropdownRef = React.useRef()
  const hamburgerRef = React.useRef()

  const [isOpen, setIsOpen] = React.useState(false)

  const toggle = React.useCallback(() => {
    setIsOpen(!isOpen)
  }, [isOpen])

  const close = React.useCallback(e => {
    setIsOpen(false)
  }, [])

  useOnClickOutside([dropdownRef, hamburgerRef], close)

  return (
    <MenuWrapper>
      <MenuHamburger ref={hamburgerRef} isOpen={isOpen} onClick={toggle} />
      <MenuDropdown ref={dropdownRef} onClick={close} data-open={isOpen}>
        {children}
      </MenuDropdown>
    </MenuWrapper>
  )
}

Menu.propTypes = {
  children: PropTypes.node.isRequired,
}
