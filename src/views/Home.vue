<template>
  <div class="home">
    <v-layout row justify-start>
      <v-flex d-inline-flex xs6>
        <v-layout column justify-start>
          <v-flex d-flex xs3>
            <CallsToday/>
          </v-flex>
          <v-flex d-flex xs3>
            <v-layout row>
              <v-flex d-inline-flex>
                <Waiting/>
              </v-flex>
              <v-flex d-inline-flex>
                <CallerInfo/>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex d-flex xs5>
            <AgentsOnline/>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex d-inline-flex xs6>
        <CallLog/>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import CallsToday from "../components/CallsToday.vue";
import Waiting from "../components/Waiting.vue";
import CallerInfo from "../components/CallerInfo.vue";
import AgentsOnline from "../components/AgentsOnline.vue";
import CallLog from "../components/CallLog.vue";

export default {
  components: {
    CallsToday,
    Waiting,
    CallerInfo,
    AgentsOnline,
    CallLog
  }
};
</script>
 