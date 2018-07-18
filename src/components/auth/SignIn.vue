<template>
<div class="signin">

<div>
  <div class="top">
    <p>Sign In</p>
  </div>

  <div class="mid">

    <div class="user">
      <span>Username</span>
      <input @keyup.enter="login" v-model.trim="user" type="text" />
      <span>{{ umsg }}</span>
    </div>
    <div class="pass">
      <span>Password</span>
      <input @keyup.enter="login" v-model.trim="pass" type="password" />
      <span>{{ pmsg }}</span>
    </div>

  </div>

  <div class="bot">
    <button @click="clear" class="btn">Clear</button>
    <button @click="login" class="btn">Submit</button>
  </div>
</div>

</div>
</template>
<script>
export default {
  name: 'SignIn',
  data () {
    return {
      user: '',
      umsg: '',
      pass: '',
      pmsg: ''
    }
  },
  methods: {
    clear () {
      this.user = ''
      this.pass = ''
    },
    check () {
      let flag = true
      if (!/^[a-zA-Z]{1}[a-zA-Z0-9]{4,14}$/.test(this.user)) {
        flag = false
      }
      if (!/^[a-zA-Z0-9]{5,15}$/.test(this.pass)) {
        flag = false
      }
      return flag
    },
    login () {
      if (!this.check()) {
        return alert('Bad Format')
      }
      this.$store.dispatch('login', { user: this.user, pass: this.pass })
        .then(data => {
          window.location.href = '/'
        })
        .catch(ex => {
          if (/401/.test(ex.message)) {
            return alert('incorrect')
          }
          alert(ex.message)
        })
    }
  },
  beforeCreate () {
    this.$root.$emit('init')
  }
}
</script>
<style lang="scss" scoped>
.signin {
  color: hsla(29, 39%, 69%, 1);
  &>div {
    padding: 1% 0;
    button {
      background-color: hsla(289, 39%, 55%, 1);
    }
  }
}
.top {
  font-size: 2.5rem;
}
.mid {
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  padding: 6px;
  text-align: left;
  &>* {
    margin: 0 auto;
    padding-bottom: 5%;
  }
  .user,
  .pass,
  .email {
    width: 70%;
  }
  span {
    font-size: 1.5rem;
  }
  input {
    width: 100%;
    font-size: 1.7rem;
    background-color: transparent;
    border: 2px solid transparent;
    border-bottom-color: hsla(58, 84%, 42%, 1);
  }
}
.bot {
  display: grid;
  grid-template-columns: 8rem 8rem;
  grid-gap: 6px;
  justify-content: center;
}
</style>
