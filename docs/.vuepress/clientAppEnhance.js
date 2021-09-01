import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import { defineClientAppEnhance } from '@vuepress/client'

export default defineClientAppEnhance(({ app, router, siteData }) => {
  app.use(ElementPlus)
})