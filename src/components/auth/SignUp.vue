<template>
<div class="signup">

<div>
  <div class="top">
    <p>Sign Up</p>
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
    <div class="email">
      <span>Email</span>
      <input @keyup.enter="login" v-model.trim="email" type="email" />
      <span>{{ emsg }}</span>
    </div>

  </div>

  <div class="bot">
    <button @click="login" class="btn">Submit</button>
  </div>
</div>

</div>
</template>
<script>
export default {
  name: 'SignUp',
  data () {
    return {
      user: '',
      umsg: '',
      pass: '',
      pmsg: '',
      email: '',
      emsg: ''
    }
  },
  watch: {
    user: function (n, o) {
      this.check()
    },
    pass: function (n, o) {
      this.check()
    },
    email: function (n, o) {
      this.check()
    }
  },
  methods: {
    clear () {
      this.user = this.pass = this.email = ''
    },
    check () {
      let flag = true
      if (!/^[a-zA-Z]{1}[a-zA-Z0-9]{4,14}$/.test(this.user)) {
        this.umsg = '5~15 alphanum with leading alpha'
        flag = false
      } else {
        this.umsg = ''
      }
      if (!/^[a-zA-Z0-9]{5,15}$/.test(this.pass)) {
        this.pmsg = '5~15 alphanum'
        flag = false
      } else {
        this.pmsg = ''
      }
      if (!/^(www.)?[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]+$/.test(this.email)) {
        this.emsg = 'invalid form'
        flag = false
      } else {
        this.emsg = ''
      }
      return flag
    },
    login () {
      this.check() &&
      this.$axios.post('/api/user', { user: this.user, pass: this.pass, email: this.email })
        .then(data => {
          this.$store.dispatch('login', { user: this.user, pass: this.pass })
            .then(data => {
              window.location.href = '/'
            })
        })
        .catch(ex => {
          alert(ex.message)
          console.log(ex)
        })
    }
  },
  beforeCreate () {
    this.$root.$emit('init')
  }
}
</script>
<style lang="scss" scoped>
.signup {
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
  grid-template-columns: 15rem;
  grid-gap: 6px;
  justify-content: center;
}
</style>
