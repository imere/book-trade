<template>
<div class="books container">

<div v-if="$store.state.user" class="trade">

  <div class="ctrl">
    <button @click="toggle" class="btn btn-primary" data-id="require">{{ data.require.length + ' Require(s)' }}</button>
    <button @click="toggle" class="btn btn-primary" data-id="request">{{ data.request.length + ' Request(s)' }}</button>
  </div>

  <div>

    <div v-if="data.require.length" id="require">
      <p>Require</p>
      <ul>
        <li v-for="(v, i) in data.require" :key="i" :id="v._id" :title="v.title" :class="[{ acc: v.acc }]">
          <p>{{ v.title }}</p>
          <p>{{ 'user: ' + v.from }}</p>
          <p>
            <i @click="del(v._id)" class="fas fa-times fa-fw" title="delete"></i>
          </p>
        </li>
      </ul>
    </div>
    <div v-if="data.request.length" id="request">
      <p>Request</p>
      <ul>
        <li v-for="(v, i) in data.request" :key="i" :id="v._id" :title="v.title" :class="[{ acc: v.acc }]">
          <p>{{ v.title }}</p>
          <p>{{ 'user: ' + v.to }}</p>
          <p>
            <i @click="dec(v._id)" class="fas fa-times fa-fw" title="decline"></i>
            <i v-if="!v.acc" @click="acc(v._id)" class="fas fa-check fa-fw" title="accept"></i>
          </p>
        </li>
      </ul>
    </div>

  </div>

</div>

<div v-if="books.length" class="show">
  <ul>
    <li v-for="(v, i) in books" :key="i">
      <i v-if="$store.state.user && $store.state.user !== v.from && $store.state.user !== v.to && !v.to && !v.acc" @click="add(v._id)" title="require" class="fas fa-exchange-alt fa-fw"></i>
      <img :title="v.title" :alt="v.title" :src="v.pic" onerror="this.src=window.HOLDER;this.src=undefined;" />
    </li>
  </ul>
</div>

<div v-if="!loading && !books.length" class="tip">
  <div v-if="!error">Nothing Found</div>
  <div v-else>{{ error }}</div>
</div>

</div>

</template>

<script>
export default {
  name: 'Books',
  props: {
    data: {
      type: Object,
      default: function () {
        return {
          require: [],
          request: []
        }
      }
    },
    books: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      loading: true,
      error: ''
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
    toggle (e) {
      // eslint-disable-next-line
      $('#' + e.currentTarget.dataset.id).slideToggle('fast')
    },
    // delete require
    del (id) {
      this.$axios.put('/api/book/require/del', { user: this.$store.state.user, id })
        .then(data => {
          this.remove(document.getElementById(id))
          let r = this.$props.data.require
          r.pop(r[r.findIndex(v => v._id === id)])
        })
        .catch(ex => {
          alert(ex.message)
          console.log(ex)
        })
    },
    // add require
    add (id) {
      let t = window.event.currentTarget
      this.$axios.put('/api/book/require/add', { user: this.$store.state.user, id: id })
        .then(data => {
          data = data.data
          this.remove(t)
          this.$props.data.require.push(data)
        })
        .catch(ex => {
          alert(ex.message)
          console.log(ex)
        })
    },
    // decline request
    dec (id) {
      this.$axios.put('/api/book/request/dec', { user: this.$store.state.user, id })
        .then(data => {
          this.remove(document.getElementById(id))
          let r = this.$props.data.request
          r.pop(r[r.findIndex(v => v._id === id)])
        })
        .catch(ex => {
          alert(ex.message)
          console.log(ex)
        })
    },
    // accept request
    acc (id) {
      let t = window.event.currentTarget
      this.$axios.put('/api/book/request/acc', { user: this.$store.state.user, id })
        .then(data => {
          this.remove(t)
          // eslint-disable-next-line
          $('#' + id).addClass('acc')
        })
        .catch(ex => {
          alert(ex.message)
          console.log(ex)
        })
    },
    getAll () {
      this.$axios.post('/api/book/all', { user: this.$store.state.user })
        .then(data => {
          data = data.data
          if (!data.length) {
            return
          }
          let u = this.$store.state.user
          if (u) {
            for (let v of data) {
              this.$props.books.push(v)
              if (v.from === u && v.to) {
                this.$props.data.request.push(v)
              } else if (v.to === u) {
                this.$props.data.require.push(v)
              }
            }
          } else {
            for (let v of data) {
              this.$props.books.push(v)
            }
          }
        })
        .catch(ex => {
          this.error = ex.message
          console.log(ex)
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  beforeCreate () {
    this.$root.$emit('init')
  },
  mounted () {
    this.getAll()
  }
}
</script>

<style lang="scss">
.trade {
  margin: 2% 0 3%;
}
.ctrl {
  display: flex;
  width: 100%;
  height: 50px;
  button {
    width: 50%;
    height: 40px;
  }
}
.show {
  ul {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    li {
      position: relative;
      i {
        position: absolute;
        top: 0;
        right: 0;
        width: 30px;
        height: 20px;
        line-height: 20px;
        color: var(--light);
        background-color: var(--primary);
        opacity: 0.8;
        &:hover {
          opacity: 1;
          cursor: pointer;
        }
      }
    }
  }
}
#require,
#request {
  display: none;
  margin: 2rem 0;
  padding: 0 1rem 0 0;
  &>p {
    color: var(--light);
  }
  ul {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    margin: 0;
    li {
      min-width: 18rem;
      margin: 4px 1rem;
      border-radius: 3px;
      background-color: var(--light);
      opacity: 0.6;
      &:hover {
        opacity: 0.8;
      }
      p {
        width: 100%;
        margin: 0;
        padding: 5px;
        text-align: center;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
      }
      i {
        display: inline-block;
        height: 100%;
        line-height: 30px;
        border-radius: 3px;
        transition: all 0.2s linear;
        &:hover {
          color: var(--light);
          cursor: pointer;
        }
        &.fa-check:hover {
          background-color: var(--success);
        }
        &.fa-times:hover {
          background-color: var(--danger);
        }
      }
    }
  }
}
#require {
  i {
    width: 100%;
  }
  .acc {
    background-color: var(--success);
    p:nth-of-type(1) {
      color: var(--light);
    }
  }
}
#request {
  i {
    width: 40%;
  }
  .acc {
    background-color: var(--success);
    p:nth-of-type(1),
    p:nth-of-type(2) {
      color: var(--light);
    }
  }
}
.tip {
  height: 4rem;
  color: var(--info);
  background-color: var(--light);
  border-radius: 7px;
  * {
    line-height: 4rem;
  }
}
</style>
