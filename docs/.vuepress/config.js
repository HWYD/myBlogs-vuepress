const { path } = require('@vuepress/utils')
module.exports = {
  lang: 'zh-CN',
  title: 'dylan的博客',
  description: '认真写点东西',
  base:'/myBlogs/',
  themeConfig: {
    logo: '/images/face.jpg',
    navbar: [
      // NavbarItem
      {
        text: '主页',
        link: '/'
      },
      // {
      //   text: '标签',
      //   link: '/label-blogs/'
      // },
      // NavbarGroup
      // {
      //   text: '笔记',
      //   children: [
      //     {
      //       text: 'CSS',
      //       link: '/notes/css-notes/'
      //     },
      //     {
      //       text: 'JavaScript',
      //       link: '/notes/js-notes/'
      //     },
      //     {
      //       text: 'vue',
      //       link: '/notes/vue-notes/'
      //     },
      //     {
      //       text: 'react',
      //       link: '/notes/react-notes/'
      //     },
      //     {
      //       text: 'threejs',
      //       link: '/blogs/threejs-blogs/threejs.md'
      //     },
      //     {
      //       text: 'epubjs',
      //       link: '/blogs/epubjs.md'
      //     },
      //     {
      //       text: 'proxy代理',
      //       link: '/blogs/js-blogs/useproxy.md'
      //     },
      //     {
      //       text: '数据结构和算法',
      //       link: '/notes/data-structure'
      //     }
      //   ]
      // },
      {
        text: '时间线',
        link: '/timeline'
      },
      {
        text: '链接',
        children: [
          {
            text: 'github',
            link: 'https://github.com/HWYD'
          }
        ]
      }
    ],
    sidebar: {
      '/notes/css-notes/': [
        {
          text: 'Guide',
          children: ['/guide/README.md', '/guide/getting-started.md']
        }
      ],
      '/notes/js-notes/': [
        {
          text: 'Reference',
          children: ['/reference/cli.md', '/reference/config.md']
        }
      ]
    }
  },
  plugins: [
    [
      '@vuepress/register-components',
      {
        componentsDir: path.resolve(__dirname, './components'),
      },
    ],
  ],
}
