<template>
  <div class="changerequest">
    <h4>Change requests</h4>
    <v-text-field v-model="request"></v-text-field>
    <v-btn @click="addRequest" color="success">Submit</v-btn>
  </div>
</template>
 
 <script>
export default {
  data() {
    return {
      request: ""
    }
  },
  methods: {
    addRequest() {
      alert("No")
    }
  }
}
</script>