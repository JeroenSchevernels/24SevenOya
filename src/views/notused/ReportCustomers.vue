<template>
  <v-layout column>
    <v-flex>
      <v-card>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="calc" color="primary">Show customer report</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>     
    </v-flex>
    <v-flex>
      <v-card>
        <v-alert dismissible v-model="alert" type="warning">No customer data found!</v-alert>
        <v-data-table 
            :headers="headers" 
            :items="customers"
            :pagination.sync="pagination"           
            >
          <template v-slot:items="props">
            <tr>
              <td>{{ props.item.called }}</td>
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
    alert: false,
    headers: [
      { text: "Called", value: "called"  },
      { text: "Number", value: "number" },
      { text: "Name", value: "name" }
    ],
    customers: [],
    pagination: {
      sortBy: 'called',
      descending: true,
      rowsPerPage: 25
    },
  }),
  methods: {
    calc() {
      let self = this;
      self.customers = [];

      const db = firebase.firestore();

      db.collection("customers")
        .get()
        .then(function(querySnapshot) {
          if (querySnapshot.size > 0) {
            querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              //console.log(doc.id, " => ", doc.data());
              self.customers.push({
                called: doc.data().called,
                number: doc.id,
                name: doc.data().name.trim()
              });
            });
          } else {
            self.alert = true;
          }
        });
    }
  }
};
</script>