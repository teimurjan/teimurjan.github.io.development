import React from 'react'
import PropTypes from 'prop-types'
import kebabCase from 'lodash/kebabCase'
import { graphql } from 'gatsby'
import Layout from '../../components/layout'
import { Container } from '../../components/container/index.styles'
import { Input } from '../../components/input/index.styles'
import { TagsTitle, TagButton, TagButtonsWrapper } from './index.styles'

const TagsPage = ({
  data: {
    allMarkdownRemark: { group }
  }
}) => {
  const [filterText, setFilterText] = React.useState('')

  const onFilterTextChange = e => setFilterText(e.currentTarget.value)

  return (
    <Layout>
      <Container>
        <TagsTitle>Find by tag:</TagsTitle>
        <Input value={filterText} onChange={onFilterTextChange} />
        <TagButtonsWrapper>
          {group
            .filter(tag => tag.fieldValue.includes(filterText))
            .map(tag => (
              <TagButton
                key={tag.fieldValue}
                to={`/blog/tags/${kebabCase(tag.fieldValue)}/`}
              >
                {tag.fieldValue}
              </TagButton>
            ))}
        </TagButtonsWrapper>
      </Container>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(limit: 2000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`

export default TagsPage

TagsPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired
        }).isRequired
      )
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired
      })
    })
  })
}
