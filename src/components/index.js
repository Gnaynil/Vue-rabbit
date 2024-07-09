//把components中的所有组件都进行全局化注册
//通过插件的方式
import ImageView from '@/components/ImageView/index.vue'
import Sku from '@/components/XtxSku/index.vue'
import Loading from '@/components/Loading/index.vue'
import Banner from '@/components/Banner/index.vue'
// import Sku from '@/components/XtxSku/Sku.vue'


export const componentPlugin = {
    install(app){
        //app.component('组件名字',组件配置对象)
        app.component('XtxImageView',ImageView)
        app.component('XtxSku',Sku)
        app.component('XtxLoading',Loading)
        app.component('XtxBanner',Banner)
    }
}