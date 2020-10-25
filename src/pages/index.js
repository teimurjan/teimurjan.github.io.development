import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import {
  IndexPageImage,
  IndexPageTitle,
  IndexPageSubTitle,
  IndexPageWrapper,
  IndexPageDescription,
  IndexPageDescriptionContainer,
  IndexPageContentContainer,
  IndexPageCardsContainer,
  IndexPageAnimatedSkillCard
} from '../pages-styles/index.styles'
import { Container } from '../components/container/index.styles'

const IndexPage = ({ data: { image } }) => {
  return (
    <Layout>
      <Container>
        <IndexPageWrapper>
          <IndexPageContentContainer>
            <IndexPageTitle>Teimur Gasanov</IndexPageTitle>
            <IndexPageSubTitle>Senior Frontend Engineer</IndexPageSubTitle>
            <IndexPageDescriptionContainer>
              <IndexPageDescription>
                I am a purposeful Frontend Engineer with excellent
                communication, management, and problem-solving skills. I am the
                type of human who is constantly self-learning and improving
                himself.
              </IndexPageDescription>
            </IndexPageDescriptionContainer>
            <IndexPageCardsContainer>
              <IndexPageAnimatedSkillCard
                delay={0}
                emoji="🙍🏼‍♂️"
                text="Age"
                value="23"
              />
              <IndexPageAnimatedSkillCard
                delay={300}
                emoji="👨🏼‍💻"
                text="Years of experience"
                value="5+"
              />
              <IndexPageAnimatedSkillCard
                delay={600}
                emoji="💼"
                text="Satisfied employers"
                value="8"
              />
              <IndexPageAnimatedSkillCard
                delay={900}
                emoji="💥"
                text="Portfolio projects"
                value="20+"
              />
              <IndexPageAnimatedSkillCard
                delay={1200}
                emoji="🎙"
                text="Public talks"
                value="3"
              />
            </IndexPageCardsContainer>
          </IndexPageContentContainer>
          <IndexPageImage fluid={image.childImageSharp.fluid} />
        </IndexPageWrapper>
      </Container>
    </Layout>
  )
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    image: PropTypes.shape({
      childImageSharp: PropTypes.shape({ fluid: PropTypes.object.isRequired })
    })
  })
}

export const query = graphql`
  query {
    image: file(relativePath: { eq: "me.png" }) {
      childImageSharp {
        fluid(maxWidth: 1000, traceSVG: { color: "#ff5780" }) {
          ...GatsbyImageSharpFluid_tracedSVG
        }
      }
    }
  }
`

export default IndexPage
