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
  { text: 'Conferences', emoji: '🎙', value: '4' }
]

const IndexPage = ({
  data: { image, experience, education, conferences, publications, media }
}) => {
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
          {[experience, education, conferences, publications, media].map(
            data => (
              <IndexPageWrapper key={data.id}>
                <IndexPageTitle>{data.frontmatter.title}</IndexPageTitle>
                <MarkdownContent
                  dangerouslySetInnerHTML={{ __html: data.html }}
                />
              </IndexPageWrapper>
            )
          )}
        </IndexPageAnimatedContent>
      </Container>
    </Layout>
  )
}

const markdownShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  html: PropTypes.string.isRequired,
  frontmatter: PropTypes.shape({ title: PropTypes.string.isRequired })
})

IndexPage.propTypes = {
  data: PropTypes.shape({
    image: PropTypes.shape({
      childImageSharp: PropTypes.shape({ fluid: PropTypes.object.isRequired })
    }),
    experience: markdownShape,
    education: markdownShape,
    conferences: markdownShape,
    publications: markdownShape,
    media: markdownShape
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
    conferences: markdownRemark(
      fileAbsolutePath: { regex: "//src/markdown/conferences.md$/" }
    ) {
      fileAbsolutePath
      html
      id
      frontmatter {
        title
      }
    }
    publications: markdownRemark(
      fileAbsolutePath: { regex: "//src/markdown/publications.md$/" }
    ) {
      fileAbsolutePath
      html
      id
      frontmatter {
        title
      }
    }
    media: markdownRemark(
      fileAbsolutePath: { regex: "//src/markdown/media.md$/" }
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
