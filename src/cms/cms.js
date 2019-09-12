import React from 'react'

import CMS from 'netlify-cms-app'
import uploadcare from 'netlify-cms-media-library-uploadcare'
import cloudinary from 'netlify-cms-media-library-cloudinary'

import BlogPostPreview from './preview-templates/blog-post'

import '../components/layout/index.css'
import '../components/layout/index.override.css'

CMS.registerMediaLibrary(uploadcare)
CMS.registerMediaLibrary(cloudinary)

CMS.registerPreviewTemplate('blog', BlogPostPreview)
