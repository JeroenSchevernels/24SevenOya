<template>
  <div class="home">
    <v-container fluid grid-list-md>
      <v-layout row wrap style="height: 88vh">
        <v-flex d-flex xs12 sm7>
          <v-layout column wrap>
            <CallsToday/>
            <v-flex d-flex>
              <v-layout row wrap>
                <Waiting/>
                <CallerInfo/>
              </v-layout>
            </v-flex>
            <AgentsOnline/>
          </v-layout>
        </v-flex>
        <v-flex d-flex>
          <v-layout column>
            <CallLog/>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import CallsToday from '../components/CallsToday.vue'
import Waiting from '../components/Waiting.vue'
import CallerInfo from '../components/CallerInfo.vue'
import AgentsOnline from '../components/AgentsOnline.vue'
import CallLog from '../components/CallLog.vue'

export default {
	components:{
    CallsToday,
    Waiting,
    CallerInfo,
    AgentsOnline,
    CallLog
	}	
}
</script>
 