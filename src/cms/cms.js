import CMS from 'netlify-cms-app'
import uploadcare from 'netlify-cms-media-library-uploadcare'
import cloudinary from 'netlify-cms-media-library-cloudinary'

import { extractCritical } from 'emotion-server'
import { renderToString } from 'react-dom/server'

import BlogPostPreview from './preview-templates/blog-post'

CMS.registerMediaLibrary(uploadcare)
CMS.registerMediaLibrary(cloudinary)

CMS.registerPreviewTemplate('blog', BlogPostPreview)

const StubBlogPostPreview = (
  <BlogPostPreview
    entry={{
      getIn: ([_, field]) => {
        if (field === 'date') return '25.06.1997'
        if (field === 'title') return 'Hello World'
        if (field === 'tags') return ['foo', 'bar']
      },
    }}
    widgetFor={_ => <div>Blog Post content</div>}
  />
)
const { css } = extractCritical(renderToString(<StubBlogPostPreview />))
CMS.registerPreviewStyle(css, { raw: true })
