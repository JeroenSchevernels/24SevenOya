<template>
    <v-card v-bind:style="{ backgroundColor: agentsBoxColor}">
      <v-toolbar flat>
        <v-toolbar-title>Support logged in: {{agentsOnline}}</v-toolbar-title>
      </v-toolbar>
      <v-layout row>
        <v-card-text class="text-xs-left">
          <span class="display-3">
            <v-icon x-large left color="green">person_outline</v-icon>
            {{agentsAvailable}}
          </span>
        </v-card-text>
        <v-card-text class="text-xs-right">
          <span class="display-3">
            {{agentsBusy}}
            <v-icon x-large right color="red">person</v-icon>
          </span>
        </v-card-text>
      </v-layout>
      <v-layout row>
        <v-flex>
          <div class="text-xs-center">
            <v-chip
              v-for="agent in supportOnline"
              v-bind:class="agent.status"
              :key="agent.id"
              @click="agent.details = !agent.details"
            >
              <v-avatar v-if="agent.avatar != ''">
                <img :src="agent.avatar">
              </v-avatar>
              {{ agent.name }} : {{ agent.outgoingCalls + agent.incomingCalls }}
              <span
                v-if="agent.details"
                class="grey--text text--darken-2"
              >
                <v-icon small>call_received</v-icon>
                {{agent.incomingCalls}}
                <v-icon small>call_made</v-icon>
                {{agent.outgoingCalls}}
              </span>
            </v-chip>
          </div>
        </v-flex>
      </v-layout>
    </v-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "AgentsOnline",
  computed: {
    ...mapState(["agentsOnline", "agentsBusy"]),
    ...mapGetters(["supportOnline"]),
    agentsBoxColor: function() {
      return (
        "RGB(255," +
        (255 - (255 * this.agentsBusy) / this.agentsOnline) +
        "," +
        (255 - (255 * this.agentsBusy) / this.agentsOnline) +
        ")"
      );
    },
    agentsAvailable: function() {
      return this.agentsOnline - this.agentsBusy;
    }
  }
};
</script>

<style scoped>
.AVAILABLE,
.RINGING {
  background-color: #a2f282 !important;
}

.BUSY {
  background-color: #f7796a !important;
}

.OTHER {
  background-color: #e7e7e7 !important;
}
</style>
