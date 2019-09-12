import React from 'react'

import CMS from 'netlify-cms-app'
import uploadcare from 'netlify-cms-media-library-uploadcare'
import cloudinary from 'netlify-cms-media-library-cloudinary'

import $ from 'cheerio'
import { extractCritical } from 'emotion-server'
import { renderToString } from 'react-dom/server'

import BlogPostPreview from './preview-templates/blog-post'

CMS.registerMediaLibrary(uploadcare)
CMS.registerMediaLibrary(cloudinary)

CMS.registerPreviewTemplate('blog', BlogPostPreview)


// REGISTERING STYLES
const stubBlogPostPreview = (
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
const html = renderStylesToString(renderToString(stubBlogPostPreview))
CMS.registerPreviewStyle(
  $(html)
    .find('style')
    .map((i, style) => $(style).html())
    .toArray()
    .join(''),
  { raw: true }
)
