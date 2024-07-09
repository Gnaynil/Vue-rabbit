// 定义懒加载插件
import { useIntersectionObserver } from '@vueuse/core'
import { ElMessage } from 'element-plus';
//注册图片懒加载
export const lazyPlugin = {
  install(app) {
    // 懒加载指令逻辑
    app.directive('img-lazy', {
      mounted(el, binding) {
        // el: 指令绑定的那个元素 img
        // binding: binding.value  指令等于号后面绑定的表达式的值  图片url
        const { stop } = useIntersectionObserver(
          el,
          ([{ isIntersecting }]) => {
            if (isIntersecting) {
              // 进入视口区域
              el.src = binding.value
              stop()
            }
          },
        )
      }
    })
  }
}

//注册点击文本复制到剪切板
export const copyText = {
  install(app) {
    //复制文本指令逻辑
    app.directive('copy', {
      //el:指令绑定元素 p或b
      //binding:binding.value  指令后面的文本值
      mounted(el, binding) {
        // 监听点击事件
        el.addEventListener('click', () => {
          //创建textarea元素
          const texarea = document.createElement('textarea')
          //将需要复制文本的内容设置为textarea的值
          texarea.value = binding.value;
          //将textarea添加到文档中
          document.body.appendChild(texarea)
          //选中textarea中内容
          texarea.select()
          //执行复制命令
          document.execCommand('copy')
          //删除textarea元素
          document.body.removeChild(texarea)
          //复制成功提示
          ElMessage.success('复制成功')
        })
      },
      //组件销毁时删除监听事件
      beforeUnmount(el) {
        el.removeEventListener('click', null)
      }
    })
  },

}