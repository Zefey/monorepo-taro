const fs = require('fs')
const path = require('path')

// TODO: 路径使用options传入
module.exports = (ctx, options) => {
    // plugin 主体
    ctx.onBuildStart(() => {
        const packagePath = path.join(__dirname,'../../..')
        const dist = path.join(packagePath,'./project/demo1/src/pages/')
        const pages = fs.readdirSync(path.join(packagePath,'./pages'))
        pages.forEach(p => {
            const dirPath = path.join(dist,p)
            if(!fs.existsSync(dirPath)){
                fs.mkdirSync(dirPath)
            }
            const name = path.join(dirPath,`index.ts`)
            const data = `import ${p} from '${p}';export default ${p}`
            fs.writeFileSync(name,data)
        })
        console.log('编译开始！',pages)
    })
    ctx.onBuildFinish(() => {
      console.log('编译结束！')
    })
}