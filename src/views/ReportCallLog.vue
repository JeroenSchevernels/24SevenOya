<template>
  <v-layout column>
    <v-flex xs1>
      <v-card>
        <v-card-actions>
          <v-spacer></v-spacer>   
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="date"
                label="Choose a date"
                prepend-icon="event"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              first-day-of-week="1"
              @input="menu = false"
              :max="yesterday"
            ></v-date-picker>
          </v-menu>
          <v-spacer></v-spacer>
          <v-btn @click="calc" color="primary">Show call log</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>     
    </v-flex>
    <v-flex xs10>
      <v-card>
        <v-alert dismissible v-model="alert" type="warning">No data found for that date!</v-alert>
        <v-data-table 
            :headers="headers" 
            :items="calls"
            hide-actions>
          <template v-slot:items="props">
            <tr>
              <td>{{ props.item.time }}</td>
              <td>{{ props.item.number }}</td>
              <td>{{ props.item.name }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from "vuex";

var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");

export default {
  data: () => ({
    date: new Date().toISOString().substr(0, 10),
    menu: false,
    alert: false,
    headers: [
      { text: "Time", value: "time" },
      { text: "Number", value: "number" },
      { text: "Name", value: "name" }
    ],
    calls: []
  }),
  methods: {
    calc() {
      let self = this;
      self.calls = [];

      const db = firebase.firestore();

      db.collection("calllog")
        .doc("calllog")
        .collection(self.date)
        .get()
        .then(function(querySnapshot) {
          if (querySnapshot.size > 0) {
            querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              //console.log(doc.id, " => ", doc.data());
              self.calls.push({
                time: self.ts2time(doc.data().timestamp),
                number: doc.data().number,
                name: doc.data().name.trim()
              });
            });
          } else {
            self.alert = true;
          }
        });
    },
    ts2time(number) {
      let timestamp = new Date(number);
      let hours = "0" + timestamp.getHours();
      let minutes = "0" + timestamp.getMinutes();
      // let seconds = "0" + timestamp.getSeconds();
      return hours.substr(-2) + ":" + minutes.substr(-2); //+ ':' + seconds.substr(-2);
    }
  },
  computed: {
    yesterday() {
      let today = new Date();
      today.setDate(today.getDate() - 1);
      return today.toISOString().substr(0, 10);
    }
  },
  mounted() {
    this.date = this.yesterday;
  }
};
</script>