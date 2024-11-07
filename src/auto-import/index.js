
const vue3 = ['ref','computed','reactive','onMounted','watchEffect','watch'] // ....

export default function autoImportPlugin() {
  return {
    name: 'vite-plugin-auto-import', // 必须的，将会在 warning 和 error 中显示
    enforce:'pre',
    transform(code,id){
      // console.log("id:",id) // 当前的页面路径  /Users/xxx/src/App.vue
      // console.log("code:",code) //具体的页面代码  code: <template>  <div @click="add"> ...   
      let vueReg = /\.vue$/
      if(vueReg.test(id)){// 如果是vue文件 才处理
        const helpers = new Set()
        vue3.forEach(api=>{
          const reg = new RegExp(api+"(.*)")
          if(reg.test(code)){//遍历匹配的包
            helpers.add(api)// 符合条件 导入集合
          }
        })
        return code.replace('<script setup>',`<script setup>

import {${[...helpers].join(',')}} from 'vue'    //自动导入
`)
      }
      return code
    }
  }
}
