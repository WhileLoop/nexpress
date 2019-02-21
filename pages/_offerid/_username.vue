<template>
  <div>
    <input v-model="input"/>
    <button v-on:click="send">Send</button>
    <div>
      <span v-for="message in messages">
        {{ message }}
      </span>
    </div>
  </div>
</template>

<script>

// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

export default {
  data: function () {
    return {
      input: "",
      messages: [],
      socket: null
    }
  },
  mounted: function () {
    this.socket = new WebSocket('ws://nexpress.herokuapp.com/ws/' + this.$route.params.offerid)
    this.$cookies.set("SOCKET", "TESTVAL")
    this.socket.onmessage = (event) => {
      this.messages.push(event.data)
    }
  },
  methods: {
    send: function () {
      this.socket.send(this.input)
    }
  }
}
</script>

<style>
  span {
    display: block;
  }
</style>
