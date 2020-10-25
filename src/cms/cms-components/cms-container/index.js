import React from 'react'
import PropTypes from 'prop-types'
import './index.css'

const CMSContainer = ({ children }) => (
  <div className="cms-container">{children}</div>
)

CMSContainer.propTypes = {
  children: PropTypes.node.isRequired
}

export default CMSContainer
