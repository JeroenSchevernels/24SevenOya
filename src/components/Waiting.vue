<template>
  <v-card v-bind:style="{ backgroundColor: queueBoxColor}">
    <v-toolbar flat>
      <v-toolbar-title>Waiting</v-toolbar-title>
    </v-toolbar>
    <v-card-text class="text-xs-center display-3">
      {{callsWaiting}}
      <br>
      <v-icon v-if="callsWaiting>0" x-large color="red">ring_volume</v-icon>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Waiting",
  computed: {
    ...mapState(["callsWaiting"]),
    queueBoxColor: function() {
      return (
        "RGB(255," +
        (255 - this.callsWaiting * 50) +
        "," +
        (255 - this.callsWaiting * 50) +
        ")"
      );
    }
  }
};
</script>


