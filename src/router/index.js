import Vue from 'vue'
import Router from 'vue-router'
import xiaoxi from '@/components/pages/xiaoxi'
import daiban from '@/components/pages/daiban'
import zhuye from '@/components/pages/zhuye'
import lianxiren from '@/components/pages/lianxiren'
import wode from '@/components/pages/wode'
import chengjichaxun from '@/components/function/chengjichaxun'
import fazhankaohe from '@/components/function/fazhankaohe'
import kaoheliushui from '@/components/function/kaoheliushui'
import kebiaochaxun from '@/components/function/kebiaochaxun'
import qingjiashenqing from '@/components/function/qingjiashenqing'
import shangkeqiandao from '@/components/function/shangkeqiandao'
import zhuijiafenzhi from '@/components/function/zhuijiafenzhi'
import shenqingjiafen from '@/components/function/shenqingjiafen'
import qiandaoliebiao from '@/components/function/qiandaoliebiao'
import kaoheshenqing from '@/components/function/kaoheshenqing'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/dist/xiaoxi',
      name: 'xiaoxi',
      component: xiaoxi,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/dist/daiban',
      name: 'daiban',
      component: daiban,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/dist/zhuye',
      name: 'zhuye',
      component: zhuye,
      meta: {
        requiresAuth: true
      },
      children: [
        {path: '/dist/zhuye/chengjichaxun', component: chengjichaxun},
        {path: '/dist/zhuye/fazhankaohe', component: fazhankaohe},
        {path: '/dist/zhuye/kaoheliushui', component: kaoheliushui},
        {path: '/dist/zhuye/kebiaochaxun', component: kebiaochaxun},
        {path: '/dist/zhuye/qingjiashenqing', component: qingjiashenqing},
        {path: '/dist/zhuye/shangkeqiandao', component: shangkeqiandao},
        {path: '/dist/zhuye/zhuijiafenzhi', component: zhuijiafenzhi},
        {path: '/dist/zhuye/shenqingjiafen', component: shenqingjiafen},
        {path: '/dist/zhuye/qiandaoliebiao', component: qiandaoliebiao},
        {path: '/dist/zhuye/kaoheshenqing', component: kaoheshenqing}
      ]
    },
    {
      path: '/dist/lianxiren',
      name: 'lianxiren',
      component: lianxiren,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/dist/wode',
      name: 'wode',
      component: wode,
      meta: {
        requiresAuth: true
      }
    }
  ]
})
