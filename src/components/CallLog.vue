<template>
    <v-card >
      <v-toolbar flat dark>
        <v-toolbar-title>Call log</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      </v-toolbar>
      <v-data-table
        :input="call"
        :headers="headers"
        :items="call"
        :search="search"
        height="85vh"
        fixed-header
        disable-pagination
        hide-default-footer
      > 
        <template v-slot:body="{ items }">
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>{{item.time}}</td>
              <td>{{item.number}}</td>
              <td v-if="item.name.length <= 25">{{item.name}}</td>
              <td v-else>{{item.name.substring(0, 20) + '..'}}</td>

              <td>{{item.answered}}</td>
              <!-- <td>{{item.timeTaken}}</td> -->
            </tr>
          </tbody>
        </template>
        <v-alert
          slot="no-results"
          :value="true"
          color="error"
          icon="warning"
        >Your search for "{{ search }}" found no results.</v-alert>
      </v-data-table>
    </v-card>
</template>

<script>
export default {
  name: "CallLog",
  computed: {
    call() {
      return this.$store.getters.call
    }
  },
  watch: {
    call (newCall, oldCall){
      var self = this
      if(newCall.status != oldCall.status){
        self.forceRerender()
      }
    }
  },
  data() {
    return {
      windowSize: {
        x:0,
        y:0
      },
      search: "",
      headers: [
        {
          text: "Time",
          value: "time"
        },
        {
          text: "Number",
          value: "number"
        },
        {
          text: "Name",
          value: "name"
        },
        {
          text: "Agent",
          value: "answered"
        },
        // {
        //   text: "Taken",
        //   value: "timeTaken"
        // }
      ]
    }
  }
};
</script>


