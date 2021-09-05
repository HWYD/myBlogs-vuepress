import 'element-plus/dist/index.css'
import { ElButton,ElRow,ElCol,ElCard,ElCarousel,ElPagination } from 'element-plus'
      
import { defineClientAppEnhance } from '@vuepress/client'

export default defineClientAppEnhance(({ app, router, siteData }) => {
  [ElButton,ElRow,ElCol,ElCard,ElCarousel,ElPagination ].forEach(item => app.use(item))
})