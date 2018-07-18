import Vue from 'vue'
import Router from 'vue-router'
import NotFound from '@/components/NotFound'
import Home from '@/components/Home'
import Books from '@/components/book/Books'
import SignUp from '@/components/auth/SignUp'
import SignIn from '@/components/auth/SignIn'
import Settings from '@/components/user/Settings'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/books',
      name: 'Books',
      component: Books
    },
    {
      path: '/auth/signup',
      name: 'SignUp',
      component: SignUp,
      meta: {
        j: true
      }
    },
    {
      path: '/auth/signin',
      name: 'SignIn',
      component: SignIn
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: {
        auth: true
      }
    },
    {
      path: '/*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})

router.beforeEach(function (to, from, next) {
  if (to.matched.some(p => p.meta.auth)) {
    if (sessionStorage.getItem('user')) {
      next()
    } else {
      next({ path: '/auth/signin', query: { redirect: to.fullPath } })
    }
  } else {
    next()
  }
})

export default router
