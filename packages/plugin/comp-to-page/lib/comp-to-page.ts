/**
 * 插件流程
 * 1.读取配置文件
 * 2.生成临时路由
 * 3.处理 "npm:" 前缀的页面
 * 4.匹配公共 packages/page 页面
 * 5.写入对应项目中
 * 6.生成 .gitignore 禁公共页面提交
 * 
 */
import fs from 'fs'
import path from 'path'

interface IPluginOptions {
  configPath: string
}

interface IOptions {
  ctx: any,
  configPath: string
}

// window路径处理
export function winPath(path: string) {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path)
  if (isExtendedLengthPath) {
    return path
  }
  return path.replace(/\\/g, '/')
}

class TaroPluginCompToPage {
  static readonly pluginName: string = 'TaroPluginCompToPage'
  private mark:string = 'npm:'
  private configPath:string
  private ctx: any
  private sourcePath: string
  private rootPath: string
  private chalk: any

  constructor({ctx,configPath}: IOptions) {
    const {chalk} = ctx.helper
    this.sourcePath = winPath(ctx.paths.sourcePath)
    this.rootPath = path.join(__dirname,'../../../')
    this.chalk = chalk
    this.ctx = ctx
    this.configPath = configPath || path.join(this.sourcePath,'app.page.js')
  }

  install() {
    this.ctx.onBuildStart(() => {
      console.log('this.configPath',this.configPath)
      // 1.读取配置文件
      const pageConfig = require(this.configPath)

      // 2.生成临时路由
      const fileData = fs.readFileSync(this.configPath).toString().replace(new RegExp(this.mark,'g'),'')
      const tempDir = path.join(this.sourcePath,'.temp')
      if(!fs.existsSync(tempDir)){
        fs.mkdirSync(tempDir)
      }
      fs.writeFileSync(path.join(tempDir,'page.js'),fileData)

      const allPage:string[] = []
      if(pageConfig.pages){
        allPage.push(...pageConfig.pages)
      }
      if(pageConfig.subpackages){
        const pages = pageConfig.subpackages.map((pkg:any) => 
          pkg.pages.map((page:string)=>`${pkg.root}/${page}`)
        ).flat(1)
        allPage.push(...pages)
      }
      // 3.处理 "npm:" 前缀的页面
      const findPage = allPage.filter(v=>v.includes(this.mark))
      .map(v=>v.replace(this.mark,'').replace('/index',''))

      for(let i=0;i<findPage.length;i++){
        const [module,name] = findPage[i].split('pages/')
        const p = findPage[i].replace(module,'')
        if(!fs.existsSync(path.join(this.rootPath,p))){
          // 4.匹配公共 packages/page 页面
          console.log(`${this.chalk.red(`${TaroPluginCompToPage.pluginName} ${p}不存在`)}`)
          continue
        }
        // 5.写入对应项目中
        const dirpath = path.join(this.sourcePath,findPage[i])
        if(!fs.existsSync(dirpath)){
          fs.mkdirSync(dirpath,{recursive:true})
        }
        const filepath = path.join(dirpath,'index.ts')
        const content = `import ${name} from '${name}';export default ${name}`
        fs.writeFileSync(filepath,content)
      }

      // 6.生成 .gitignore 禁公共页面提交
      const ignorePath =  path.join(this.sourcePath,'.gitignore')
      const ignoreContent = `
# ${TaroPluginCompToPage.pluginName}
${findPage.map(v=>v).join('/\n')}
# ${TaroPluginCompToPage.pluginName}`
      fs.writeFileSync(ignorePath,ignoreContent)
    })
  }
}

export default function (ctx: any, ops: IPluginOptions) {
  const plugin = new TaroPluginCompToPage({ctx, ...ops})
  plugin.install()
}