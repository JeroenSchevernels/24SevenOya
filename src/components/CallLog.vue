<template>
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>Call log DEV</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="call"
        :search="search"
        item-key="callid"
        hide-actions
        class="scrollTable"
      > 
        <template slot="items" slot-scope="props">
          <tr>
            <td>{{props.item.time}}</td>
            <td>{{props.item.number}}</td>
            <td>{{props.item.name}}</td>
            <td>{{props.item.answered}}</td>
            <td>{{props.item.timeTaken}}</td>
          </tr>
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
import { mapState, mapGetters, mapMutations } from "vuex";

export default {
  name: "CallLog",
  computed: {
    ...mapGetters(["call"])
  },
  data() {
    return {
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
          text: "Answered by",
          value: "answered"
        },
        {
          text: "Taken",
          value: "timeTaken"
        }
        // ,
        // {
        //   text: "Callid",
        //   value: "callid"
        // }
      ]
    };
  }
};
</script>


