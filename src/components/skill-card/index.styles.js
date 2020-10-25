import styled from '@emotion/styled'
import { mediaSizeLessThan, sizes } from '../../media'
import { CardWrapper } from '../card/index.styles'

export const SkillCardValue = styled.div`
  background: var(--lightestBackgroundColor);
  border-radius: 20px;
  min-width: 100px;
  text-align: center;
  padding: 20px 15px;
  margin: -20px -15px;
  font-size: 1.25rem;
  width: 150px;
  max-width: 45%;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
`

export const SkillCardWrapper = styled(CardWrapper)`
  color: var(--fontOnLightBackgroundColor);
  padding: 25px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 450px;

  @media ${mediaSizeLessThan(sizes.md)} {
    width: 100%;
  }
`

export const SkillCardLabel = styled.div`
  display: flex;
  align-items: center;
`

export const SkillCardLabelEmoji = styled.span`
  font-size: 1.25rem;
  margin-right: 15px;
`

export const SkillCardLabelText = styled.span`
  font-size: 1rem;
`
