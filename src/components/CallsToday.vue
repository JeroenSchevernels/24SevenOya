<template>
    <v-card min-height="100%" v-bind:style="{ 'background-image': callsBoxGradient}">
        <v-toolbar flat dark>
            <v-toolbar-title>Calls today: {{totalCalls}}</v-toolbar-title>
        </v-toolbar>
        <v-row>
            <v-col sm="6">
                <v-card-text class="text-sm-left display-3">
                    <v-icon x-large left color="green">call</v-icon>
                    {{callsCompleted}}
                </v-card-text>
            </v-col>
            <v-col sm="6">
                <v-card-text class="text-sm-right display-3">
                    {{callsAbandoned}}
                    <v-icon x-large right color="red">call_missed</v-icon>
                </v-card-text>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'CallsToday',
  computed: {
      ...mapState([
        'callsCompleted',
        'callsAbandoned'
    ]),
    totalCalls: function() {
        if (this.callsCompleted + this.callsAbandoned > 0) {
            return this.callsCompleted + this.callsAbandoned + " (" + Math.round(100 * this.callsCompleted / (this.callsCompleted +
                this.callsAbandoned)) + "%)"
        } else {
            return this.callsCompleted + this.callsAbandoned
        }
    },
    callsBoxGradient: function() {
        let percentage = Math.round(this.callsCompleted / (this.callsCompleted + this.callsAbandoned) * 100);
        if (percentage > 99) { //stupid, but gradient expected
            return "linear-gradient(to right, #a2f282 " + (percentage - 3) + "% ," + percentage + "% ,#a2f282 " + (percentage +
                3) + "% )";
        } else if (percentage < 1) { //stupid, but gradient expected
            return "linear-gradient(to right, #f7796a " + (percentage - 3) + "% ," + percentage + "% ,#f7796a " + (percentage +
                3) + "% )";
        } else {
            return "linear-gradient(to right, #a2f282 " + (percentage - 3) + "% ," + percentage + "% ,#f7796a " + (percentage +
                3) + "% )";
        }
    }
  }
}
</script>


