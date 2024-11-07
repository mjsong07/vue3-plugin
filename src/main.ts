
import { createApp } from "vue";
import App from './App.vue'

createApp(App)
  .mount('#app')


  function createPromiseError(msg) {
    return new Promise((resolve,reject) => {
      setTimeout(() => {
        reject(msg)
      }, 2000);
    })
  }
  
async function testErrorFn() {
  try { 
    await createPromiseError("网络异常") 
  } catch (e) {
    console.log("error:" + e) 
  }
} 
testErrorFn() 

