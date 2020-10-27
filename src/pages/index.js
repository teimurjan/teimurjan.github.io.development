import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import {
  IndexPageImage,
  IndexPageTitle,
  IndexPageSubTitle,
  IndexPageWrapper,
  IndexPageColumnsWrapper,
  IndexPageDescription,
  IndexPageDescriptionContainer,
  IndexPageContentContainer,
  IndexPageCardsContainer,
  IndexPageAnimatedSkillCard,
  IndexPageAnimatedContent
} from '../pages-styles/index.styles'
import { Container } from '../components/container/index.styles'
import { MarkdownContent } from '../templates/markdown/index.styles'

const skillCardsProps = [
  { text: 'Age', emoji: '🙍🏼‍♂️', value: '23' },
  { text: 'Years of experience', emoji: '👨🏼‍💻', value: '5+' },
  { text: 'Satisfied employers', emoji: '💼', value: '8' },
  { text: 'Portfolio projects', emoji: '💥', value: '20+' },
  { text: 'Public talks', emoji: '🎙', value: '3' }
]

const IndexPage = ({ data: { image, experience, education } }) => {
  return (
    <Layout>
      <Container>
        <IndexPageColumnsWrapper>
          <IndexPageContentContainer>
            <IndexPageTitle>Teimur Gasanov</IndexPageTitle>
            <IndexPageSubTitle>Senior Frontend Engineer</IndexPageSubTitle>
            <IndexPageDescriptionContainer>
              <IndexPageDescription>
                I am an engineer with significant experience in web development.
                Having excellent communication, management, and problem-solving
                skills, I&apos;m good at finding reliable solutions for atypical
                problems.
              </IndexPageDescription>
            </IndexPageDescriptionContainer>
            <IndexPageCardsContainer>
              {skillCardsProps.map((skillCardProps, i) => (
                <IndexPageAnimatedSkillCard
                  key={skillCardProps.value}
                  delay={i * 200}
                  {...skillCardProps}
                />
              ))}
            </IndexPageCardsContainer>
          </IndexPageContentContainer>
          <IndexPageImage fluid={image.childImageSharp.fluid} />
        </IndexPageColumnsWrapper>
        <IndexPageAnimatedContent delay={skillCardsProps.length * 200}>
          <IndexPageWrapper>
            <IndexPageTitle>Experience</IndexPageTitle>
            <MarkdownContent
              dangerouslySetInnerHTML={{ __html: experience.html }}
            />
          </IndexPageWrapper>
          <IndexPageWrapper>
            <IndexPageTitle>Educaiton</IndexPageTitle>
            <MarkdownContent
              dangerouslySetInnerHTML={{ __html: education.html }}
            />
          </IndexPageWrapper>
        </IndexPageAnimatedContent>
      </Container>
    </Layout>
  )
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    image: PropTypes.shape({
      childImageSharp: PropTypes.shape({ fluid: PropTypes.object.isRequired })
    }),
    experience: PropTypes.shape({
      html: PropTypes.string.isRequired
    }),
    education: PropTypes.shape({
      html: PropTypes.string.isRequired
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
    experience: markdownRemark(
      fileAbsolutePath: { regex: "//src/markdown/experience.md$/" }
    ) {
      fileAbsolutePath
      html
      id
      frontmatter {
        title
      }
    }
    education: markdownRemark(
      fileAbsolutePath: { regex: "//src/markdown/education.md$/" }
    ) {
      fileAbsolutePath
      html
      id
      frontmatter {
        title
      }
    }
  }
`

export default IndexPage
