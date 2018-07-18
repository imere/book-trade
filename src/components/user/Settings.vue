<template>
<div class="settings">

<div class="info">

  <div v-for="(v, i) in $store.state" :key="i" v-if="i !== 'book'">
    <div :class="i">
      <span>{{ i + ': ' + v }}</span>
      <input @keyup.enter="update" v-if="i === 'state'" v-model.trim="state" type="text" />
    </div>
  </div>

  <div>
    <span>Old Password</span>
    <input @keyup.enter="update" v-model.trim="opass" type="password" />
    <span>New Password</span>
    <input @keyup.enter="update" v-model.trim="pass" type="password" />
  </div>

  <div>
    <button @click="update" class="btn btn-info">Update</button>
  </div>

</div>

<div class="mybook">

  <div>
    <h3>My Books (not accepted)</h3>
  </div>

  <div>
    <input @keyup.enter="add" v-model.trim="book" type="text" placeholder="Book to trade" />
    <button @click="add">Add</button>
  </div>

  <div v-if="!error">
    <ul class="list">
      <li v-for="(v, i) in data" :key="i" :id="i" :title="v.title" v-if="!v.acc">
        <img :src="v.pic" :alt="v.title" />
        <i @click="del(i, v.id)" class="fas fa-times fa-fw" title="delete"></i>
      </li>
    </ul>
  </div>
  <div v-else>
    {{ error }}
  </div>

</div>

</div>
</template>
<script>
export default {
  name: 'Settings',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      error: '',
      book: '',
      state: '',
      opass: '',
      pass: ''
    }
  },
  methods: {
    remove (target) {
      let t = target || window.event.currentTarget
      let p = t.parentNode
      let id = p.id
      p.id = 'removechild'
      document.getElementById('removechild').removeChild(t)
      p.id = id
    },
    // get mybook
    get () {
      this.$axios.post('/api/book/mybook', { user: this.$store.state.user })
        .then(data => {
          data = data.data
          for (let v of data) {
            this.$props.data.push(v)
          }
        })
        .catch(ex => {
          this.error = ex.message
        })
    },
    // update info
    update () {
      let state = this.state
      if (state) {
        this.$axios.put('/api/user/state', { user: this.$store.state.user, state })
          .then(data => {
            this.$store.dispatch('update', { state })
            this.$root.$emit('init')
          })
          .catch(ex => {
            alert(ex.message)
            console.log(ex)
          })
      }
      if (this.opass && this.pass) {
        this.$axios.put('/api/user/pass', { user: this.$store.state.user, pass: this.pass, opass: this.opass })
          .catch(ex => {
            alert(ex.message)
            console.log(ex)
          })
      }
    },
    // add book
    add () {
      if (!this.book) return
      this.$axios.put('/api/book/' + this.book, { user: this.$store.state.user })
        .then(data => {
          data = data.data
          this.$props.data.push(data)
        })
        .catch(ex => {
          alert(ex.message)
          console.log(ex)
        })
    },
    // delete book
    del (i, id) {
      this.$axios.delete('/api/book/' + id, { user: this.$store.state.user })
        .then(data => {
          this.remove(document.getElementById(i))
        })
        .catch(ex => {
          alert(ex.message)
          console.log(ex)
        })
    }
  },
  beforeCreate () {
    this.$root.$emit('init')
  },
  mounted () {
    this.get()
  }
}
</script>
<style lang="scss" scoped>
.settings {
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  padding: 6px 5%;
  color: var(--light);
  text-align: left;
  &>div {
    padding: 1% 0;
    button {
      background-color: hsla(289, 39%, 55%, 1);
    }
  }
}
.info {
  padding: 5px 30px;
  &>* {
    padding-bottom: 1%;
  }
  .state,
  .email {
    width: 70%;
    min-width: 280px;
  }
  span {
    font-size: 1.3rem;
  }
  input {
    width: 100%;
    font-size: 1.7rem;
    background-color: transparent;
    border: 1px solid transparent;
    border-bottom-color: hsla(58, 84%, 42%, 1);
  }
}
.mybook {
  &>div {
    margin: 1rem 0;
    &:nth-of-type(2) {
      position: relative;
      width: 18rem;
      input {
        width: 100%;
        margin: 0;
        padding: 4px 4.4rem 4px 4px;
        border-radius: 7px;
      }
      button {
        width: 4rem;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        border-style: none;
        opacity: 0.9;
        &:hover {
          opacity: 1;
          cursor: pointer;
        }
      }
    }
  }
  .list {
    display: flex;
    flex-flow: row wrap;
    text-align: left;
    li {
      position: relative;
      margin: 5px;
      .fa-times {
        position: absolute;
        top: 0;
        right: 0;
        width: 20px;
        height: 20px;
        line-height: 20px;
        background-color: var(--cyan);
        transition: all 0.2s linear;
        &:hover {
          background-color: var(--danger);
          cursor: pointer;
        }
      }
    }
  }
}
</style>
