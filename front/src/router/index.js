import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

const Test = r => require.ensure([], () => r(require('@/containers/Test')), 'Test')
const NotFound = r => require.ensure([], () => r(require('@/containers/NotFound')), 'NotFound')
const Main = r => require.ensure([], () => r(require('@/containers/Main')), 'Main')
const partlist = r => require.ensure([], () => r(require('@/containers/PartList')), 'partlist')
const Tops = r => require.ensure([], () => r(require('@/containers/Tops')), 'Tops')
const Search = r => require.ensure([], () => r(require('@/containers/Search')), 'Search')
const Feedback = r => require.ensure([], () => r(require('@/containers/Feedback')), 'Feedback')
const UserCenter1 = r => require.ensure([], () => r(require('@/containers/UserCenter1')), 'UserCenter1')
const UserCenter2 = r => require.ensure([], () => r(require('@/containers/UserCenter2')), 'UserCenter2')
const Help = r => require.ensure([], () => r(require('@/containers/Help')), 'Help')
const zt = r => require.ensure([], () => r(require('@/containers/zt')), 'zt')
const recent = r => require.ensure([], () => r(require('@/containers/recent')), 'recent')
const hottest = r => require.ensure([], () => r(require('@/containers/hottest')), 'hottest')
const classify = r => require.ensure([], () => r(require('@/containers/classify')), 'classify')


const Pop2 = r => require.ensure([], () => r(require('@/containers/pop/Pop2')), 'Pop2')
const Pop3 = r => require.ensure([], () => r(require('@/containers/pop/Pop3')), 'Pop3')
const Pop6 = r => require.ensure([], () => r(require('@/containers/pop/Pop6')), 'Pop6')
const Pop8 = r => require.ensure([], () => r(require('@/containers/pop/Pop8')), 'Pop8')
const Pop10 = r => require.ensure([], () => r(require('@/containers/pop/Pop10')), 'Pop10')
const Pop12 = r => require.ensure([], () => r(require('@/containers/pop/Pop12')), 'Pop12')
const Pop13 = r => require.ensure([], () => r(require('@/containers/pop/Pop13')), 'Pop13')
const Pop14 = r => require.ensure([], () => r(require('@/containers/pop/Pop14')), 'Pop14')
const Pop15 = r => require.ensure([], () => r(require('@/containers/pop/Pop15')), 'Pop15')
const Pop16 = r => require.ensure([], () => r(require('@/containers/pop/Pop16')), 'Pop16')
const Pop17 = r => require.ensure([], () => r(require('@/containers/pop/Pop17')), 'Pop17')
const Pop18 = r => require.ensure([], () => r(require('@/containers/pop/Pop18')), 'Pop18')
const Pop19 = r => require.ensure([], () => r(require('@/containers/pop/Pop19')), 'Pop19')
const Pop20 = r => require.ensure([], () => r(require('@/containers/pop/Pop20')), 'Pop20')
const Pop21 = r => require.ensure([], () => r(require('@/containers/pop/Pop21')), 'Pop21')
//const Pop22 = r => require.ensure([], () => r(require('@/containers/pop/Pop22')), 'Pop22')

const Zt1 = r => require.ensure([], () => r(require('@/containers/zt/Zt1')), 'Zt1')
const Zt2 = r => require.ensure([], () => r(require('@/containers/zt/Zt2')), 'Zt2')
const Zt3 = r => require.ensure([], () => r(require('@/containers/zt/Zt3')), 'Zt3')
const Zt4 = r => require.ensure([], () => r(require('@/containers/zt/Zt4')), 'Zt4')
const Zt5 = r => require.ensure([], () => r(require('@/containers/zt/Zt5')), 'Zt5')
const Zt6 = r => require.ensure([], () => r(require('@/containers/zt/Zt6')), 'Zt6')
const Zt7 = r => require.ensure([], () => r(require('@/containers/zt/Zt7')), 'Zt7')
const Zt8 = r => require.ensure([], () => r(require('@/containers/zt/Zt8')), 'Zt8')
const Zt9 = r => require.ensure([], () => r(require('@/containers/zt/Zt9')), 'Zt9')
const Zt10 = r => require.ensure([], () => r(require('@/containers/zt/Zt10')), 'Zt10')
const Zt11 = r => require.ensure([], () => r(require('@/containers/zt/Zt11')), 'Zt11')
const Zt12 = r => require.ensure([], () => r(require('@/containers/zt/Zt12')), 'Zt12')
const Zt13 = r => require.ensure([], () => r(require('@/containers/zt/Zt13')), 'Zt13')
const Zt14 = r => require.ensure([], () => r(require('@/containers/zt/Zt14')), 'Zt14')

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/m/test',
      name: 'test',
      component: Test
    },
    {
      path: '/m/index',
      name: 'index',
      redirect: '/m/main/recent'
    },
    {
      path: '/m/main',
      name: 'main',
      component: Main,
      children: [
        {
          path: 'zt',
          name: 'zt',
          component: zt
        },
        {
          path: 'recent',
          name: 'recent',
          component: recent
        },
        {
          path: 'hottest',
          name: 'hottest',
          component: hottest
        },
        {
          path: 'classify',
          name: 'classify',
          component: classify
        }
      ]
    },
    {
      path: '/m/partlist/:id',
      name: 'partlist',
      component: partlist
    },
    {
      path: '/m/tops',
      name: 'tops',
      component: Tops,
    },
    {
      path: '/m/search',
      name: 'search',
      component: Search,
    },
    {
      path: '/m/feedback',
      name: 'feedback',
      component: Feedback,
    },
    {
      path: '/m/userCenter1',
      name: 'userCenter1',
      component: UserCenter1,
      beforeEnter(to, from, next) {
        const timer = setInterval(() => {
          if (window.COMKEYFINISH) {
            clearInterval(timer)
            if (store.state.userInfo.isLogin) {
              next()
            } else {
              next(Vue.$setLink('userCenter2'))
            }
          }
        }, 13)
      }
    },
    {
      path: '/m/userCenter2',
      name: 'userCenter2',
      component: UserCenter2
    },
    {
      path: '/m/help',
      name: 'help',
      component: Help,
    },
    //活动
    {
      path: '/m/pop/2',
      name: 'pop2',
      component: Pop2,
    },
    {
      path: '/m/pop/3',
      name: 'pop3',
      component: Pop3,
    },
    {
      path: '/m/pop/6',
      name: 'pop6',
      component: Pop6,
    },
    {
      path: '/m/pop/8',
      name: 'pop8',
      component: Pop8,
    },
    {
      path: '/m/pop/10',
      name: 'pop10',
      component: Pop10,
    },
    {
      path: '/m/pop/12',
      name: 'pop12',
      component: Pop12,
    },
    {
      path: '/m/pop/13',
      name: 'pop13',
      component: Pop13,
    },
    {
      path: '/m/pop/14',
      name: 'pop14',
      component: Pop14,
    },
    {
      path: '/m/pop/15',
      name: 'pop15',
      component: Pop15,
    },
    {
      path: '/m/pop/16',
      name: 'pop16',
      component: Pop16,
    },
    {
      path: '/m/pop/17',
      name: 'pop17',
      component: Pop17,
    },
    {
      path: '/m/pop/18',
      name: 'pop18',
      component: Pop18,
      beforeEnter: (to , from ,next) => {
        if(window.spcode == '02640710400051') {
          next(false)
        } else {
          next()
        }
      }
    },
    {
      path: '/m/pop/19',
      name: 'pop19',
      component: Pop19
    },
    {
      path: '/m/pop/20',
      name: 'pop20',
      component: Pop20
    },
    {
      path: '/m/pop/21',
      name: 'pop21',
      component: Pop21
    },
    /*{
      path: '/m/pop/22',
      name: 'pop22',
      component: Pop22
    },*/
    //抽奖
    {
      path: '/m/zt/1',
      name: 'zt1',
      component: Zt1,
    },
    {
      path: '/m/zt/2',
      name: 'zt2',
      component: Zt2,
    },
    {
      path: '/m/zt/3',
      name: 'zt3',
      component: Zt3,
    },
    {
      path: '/m/zt/4',
      name: 'zt4',
      component: Zt4,
    },
    {
      path: '/m/zt/5',
      name: 'zt5',
      component: Zt5,
    },
    {
      path: '/m/zt/6',
      name: 'zt6',
      component: Zt6,
    },
    {
      path: '/m/zt/7',
      name: 'zt7',
      component: Zt7,
    },
    {
      path: '/m/zt/8',
      name: 'zt8',
      component: Zt8,
    },
    {
      path: '/m/zt/9',
      name: 'zt9',
      component: Zt9,
    },
    {
      path: '/m/zt/10',
      name: 'zt10',
      component: Zt10,
    },
    {
      path: '/m/zt/11',
      name: 'zt11',
      component: Zt11,
    },
    {
      path: '/m/zt/12',
      name: 'zt12',
      component: Zt12,
    },
    {
      path: '/m/zt/13',
      name: 'zt13',
      component: Zt13,
    },
    {
      path: '/m/zt/14',
      name: 'zt14',
      component: Zt14,
    },
    {
      path: '*',
      name: '404',
      component: NotFound
    },
  ]
})

export default router
