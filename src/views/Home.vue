<template>
  <v-row no-gutters>
    <v-col cols="7">
      <v-container fill-height fluid>
        <v-row dense class="fill-height">
          <v-col cols="12">
            <CallsToday/>
          </v-col>
          <v-col cols="4">
            <Waiting/>
          </v-col>
          <v-col cols="8">
            <CallerInfo/>
          </v-col>
          <v-col cols="12">
            <AgentsOnline/>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
    <v-col  cols="5">
      <v-container>
        <v-row dense>
          <v-col cols="12">
            <CallLog/>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
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