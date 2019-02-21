<template>
  <div>
    <input v-model="input">
    <button v-on:click="send">Send</button>
    <div>
      <span v-for="message in messages">{{ message }}</span>
    </div>
  </div>
</template>

<script>
// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

export default {
  data: function() {
    return {
      input: "",
      messages: [],
      socket: null
    };
  },
  mounted: function() {
    var new_url = "ws://nexpress.herokuapp.com/ws/" + this.$route.params.offerid + "/" + this.$route.params.username;
    // var new_url = "ws://localhost:3000/ws/" + this.$route.params.offerid + "/" + this.$route.params.username;
    this.socket = new WebSocket(new_url);
    this.$cookies.set("SOCKET", "TESTVAL");
    this.socket.onmessage = event => {
      this.messages.push(event.data);
    };
  },
  methods: {
    send: function() {
      this.socket.send(this.input);
    }
  }
};
</script>

<style>
span {
  display: block;
}
button {
  background-color: #008cba;
  border: none;
  border-radius: 12px;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}
input {
  width: 80%;
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
}
</style>
