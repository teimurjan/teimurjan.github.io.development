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
  IndexPageAnimatedContent,
  IndexPageIFrame
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
  data: { image, experience, education, conferences, publications }
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
          <IndexPageWrapper>
            <IndexPageTitle>Conferences</IndexPageTitle>
            <MarkdownContent
              dangerouslySetInnerHTML={{ __html: conferences.html }}
            />
          </IndexPageWrapper>
          <IndexPageWrapper>
            <IndexPageTitle>Publications</IndexPageTitle>
            <MarkdownContent
              dangerouslySetInnerHTML={{ __html: publications.html }}
            />
          </IndexPageWrapper>
          <IndexPageWrapper>
            <IndexPageTitle>Media</IndexPageTitle>
            <IndexPageIFrame
              width="560"
              height="315"
              src="https://www.youtube.com/embed/4gPrCiwQS68"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
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
    }),
    conferences: PropTypes.shape({
      html: PropTypes.string.isRequired
    }),
    publications: PropTypes.shape({
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
  }
`

export default IndexPage
