<template>
  <v-card min-height="100%" v-bind:style="{ backgroundColor: queueBoxColor}">
    <v-toolbar flat dark>
      <v-toolbar-title>
        Waiting
      </v-toolbar-title>
    </v-toolbar>
    <v-row>
    <v-card-text class="text-sm-center display-3">
      <span>{{callsWaiting}}</span>
      <v-icon v-if="callsWaiting > 0" x-large color="red">ring_volume</v-icon>
    </v-card-text>
    </v-row>
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


