
import { parse } from '@babel/parser'
import traverse   from '@babel/traverse'
import {
  isTryStatement,
  tryStatement,
  isBlockStatement,
  catchClause,
  identifier,
  blockStatement,
} from '@babel/types'
import { transformFromAstSync } from '@babel/core' 


const catchStatement = parse(`
  console.error('error:'+err)
  console.log('https://www.google.com/search?q=+'+encodeURI(err)) // 同时输出谷歌查询
`).program.body

export default function autoImportPlugin() {
  return {
    name: 'vite-plugin-auto-tyrcatch', // 
    enforce:'pre',
    transform(code,id){
        let fileReg = /\.js$/
        if(fileReg.test(id)){ // 只过滤处理js的代码
        const ast = parse(code, {
          sourceType: 'module'
        })
        // console.log(ast)
        traverse(ast, {
          AwaitExpression(path){
            if (path.findParent((path) => isTryStatement(path.node))) { // 如果有try了 直接返回
              return 
            } 
            const blockParentPath = path.findParent((path) => isBlockStatement(path.node)) //isBlockStatement是否函数体
            const tryCatchAst  = tryStatement(
              blockParentPath.node,
              // ast中新增try的ast
              catchClause(
                identifier('err'),
                blockStatement(catchStatement),
              )
            ) 
            blockParentPath.replaceWithMultiple([tryCatchAst])  // 使用有try的ast替换之前的ast

          }
        })
        // 生成代码，generate
        code = transformFromAstSync(ast,"",{
          configFile:false
        }).code

        return code
      }
      return code
    }
  }
}
