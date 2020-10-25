import React from 'react'
import PropTypes from 'prop-types'
import {
  SkillCardWrapper,
  SkillCardValue,
  SkillCardLabel,
  SkillCardLabelEmoji,
  SkillCardLabelText
} from './index.styles'

const SkillCard = ({ className, emoji, text, value }) => (
  <SkillCardWrapper className={className}>
    <SkillCardLabel>
      <SkillCardLabelEmoji>{emoji}</SkillCardLabelEmoji>
      <SkillCardLabelText>{text}</SkillCardLabelText>
    </SkillCardLabel>
    <SkillCardValue>{value}</SkillCardValue>
  </SkillCardWrapper>
)

SkillCard.propTypes = {
  emoji: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  className: PropTypes.string
}

export default SkillCard
