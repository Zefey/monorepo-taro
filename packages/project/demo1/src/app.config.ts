import {pages, subpackages} from './.temp/page';

export default defineAppConfig({
  pages: pages,
  subpackages:subpackages,
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
})
