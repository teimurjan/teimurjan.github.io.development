import React from 'react'
import PropTypes from 'prop-types'
import { ThemeSwitcherWrapper } from './index.styles'

const ThemeSwitcher = ({ className, onToggle }) => {
  return (
    <ThemeSwitcherWrapper className={className} onClick={onToggle}>
      <div id="themeSwitcherCircle" />
    </ThemeSwitcherWrapper>
  )
}

ThemeSwitcher.propTypes = {
  className: PropTypes.string,
  onToggle: PropTypes.func
}

export default ThemeSwitcher
