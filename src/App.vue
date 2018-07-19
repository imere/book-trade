<template>
<div id="app">

  <nav>
    <div>

      <div class="nav-home">
        <router-link to="/">Home</router-link>
      </div>

      <div class="nav-auth">
        <ul v-if="!$store.state.user">
          <li>
            <router-link to="/books">All Books</router-link>
          </li>
          <li>
            <router-link to="/auth/signup">Sign up</router-link>
          </li>
          <li>
            <router-link to="/auth/signin">Sign in</router-link>
          </li>
        </ul>
        <ul v-else>
          <li>
            <router-link to="/books">All Books</router-link>
          </li>
          <li>
            <router-link to="/settings"><i class="fas fa-user-cog"></i></router-link>
          </li>
          <li>
            <a @click="logout" href="javascript:void(0);"><i class="fas fa-sign-out-alt"></i></a>
          </li>
        </ul>
      </div>

    </div>
  </nav>

  <router-view />

</div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    ssCheck () {
      try {
        let ss = sessionStorage
        ss.setItem('test', 'test')
        if (ss.getItem('test') !== 'test') {
          alert('"session storage" needed to function')
        }
        ss.removeItem('test')
      } catch (ex) {
        alert('"session storage" needed to function')
      }
    },
    init () {
      this.$store.dispatch('init')
    },
    logout () {
      this.$store.dispatch('logout')
        .then(data => {
          window.location.href = '/'
        })
        .catch(ex => {
          alert(ex.message)
        })
    }
  },
  mounted () {
    this.ssCheck()
    this.$root.$on('init', this.init)
    this.init()
    window.addEventListener('beforeunload', () => {
      let d = this.$store.state
      let user = d.user
      let email = d.email
      let state = d.state
      this.$store.dispatch('update', { user, email, state })
    })
  }
}
</script>

<style lang="scss">
@import './assets/css/main.scss';
@import './assets/css/conf.scss';
$headerH: 50px;
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  nav {
    height: $headerH;
    padding: 0 30px;
    border-bottom: 1px solid $b;
    margin-bottom: 10px;
    &>div {
      width: 100%;
      height: $headerH;
      padding: 0 5%;
      &>div {
        height: $headerH;
      }
      a {
        display: inline-block;
        line-height: $headerH;
        padding: 0 10px;
      }
    }
  }
}
.nav-home {
  float: left;
}
.nav-auth {
  float: right;
  ul {
    margin: 0;
    li {
      height: $headerH;
      display: inline-block;
    }
  }
}
.router-link-exact-active {
  background-color: $b;
}
@media all and (max-width: 411px) {
  #app {
    nav {
      padding: 0;
    }
  }
}
</style>
