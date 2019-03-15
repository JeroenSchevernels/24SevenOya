<template>
  <div id="app">
    <v-app :dark.sync="dark">
      <title>{{documentTitle}}</title>
      <v-navigation-drawer app dark v-if="isAuthenticatedFB">
        <v-layout column fill-height>
          <v-list>
            <v-list-tile to="/home">
              <v-list-tile-action>
                <v-icon large></v-icon>
              </v-list-tile-action>
              <v-list-tile-title>Dashboard</v-list-tile-title>
              <v-list-tile-action>
                <v-icon large>dashboard</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-list-group no-action sub-group value="true">
              <template v-slot:activator>
                <v-list-tile>
                  <v-list-tile-title>Reports</v-list-tile-title>
                  <v-list-tile-action>
                    <v-icon large>assessment</v-icon>
                  </v-list-tile-action>
                </v-list-tile>
              </template>
              <v-list-tile to="/reportcalllog">
                <v-list-tile-title>Historic call log</v-list-tile-title>
                <v-list-tile-action>
                  <v-icon>assignment</v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <v-list-tile to="/reportcustomers">
                <v-list-tile-title>Customers</v-list-tile-title>
                <v-list-tile-action>
                  <v-icon>assignment_ind</v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </v-list-group>
          </v-list>

          <v-spacer></v-spacer>

          <v-list>
            <v-list-tile to="/changelog">
              <v-list-tile-action>
                <v-icon>info</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-list-group no-action sub-group value="true">
              <template v-slot:activator>
                <v-list-tile>
                  <v-list-tile-title>{{$store.state.userFB.user.email}}</v-list-tile-title>
                </v-list-tile>
              </template>
              <v-list-tile v-if="$store.state.authorized" @click="logout">
                <v-list-tile-title>Logout from Oyatel</v-list-tile-title>
              </v-list-tile>
              <v-list-tile v-if="!$store.state.authorized" @click="login">
                <v-list-tile-title>Login with Oyatel</v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="logoutFB">
                <v-list-tile-title>Logout from 24SOya</v-list-tile-title>
              </v-list-tile>
            </v-list-group>
          </v-list>
        </v-layout>
      </v-navigation-drawer>
      <v-content>
        <v-container fluid grid-list-md height>
          <router-view></router-view>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "app",
  components: {},
  data() {
    return {
      dark: false,
      showMenu: false,
      showCallLog: true,
      showCaller: true,
      showWaiting: true,
      showCallsToday: true,
      showAgents: true,
      precallid: "",
      //callerNum: [],
      nextCallId: 1,
      // call: [
      //   // { // testing purpose and explanation of existing fields
      //   // 	time: '09:15',
      //   // 	number: '9191991',
      //   //  queue: 'Support NO',
      //   // 	name: ' name',
      //   // 	callid: [''],
      //   // 	status: 'new, taken, done',
      //   // 	answered: Support[i]
      //   // }
      // ],
      log: [],
      hangups: []
    };
  },
  methods: {
    logoutFB() {
      this.$store.dispatch("userSignOutFB");
    },
    ts2time(number) {
      let timestamp = new Date(number);
      let hours = "0" + timestamp.getHours();
      let minutes = "0" + timestamp.getMinutes();
      // let seconds = "0" + timestamp.getSeconds();
      return hours.substr(-2) + ":" + minutes.substr(-2); //+ ':' + seconds.substr(-2);
    },
    deauthorized() {
      this.$store.commit("deauthorize");
    },
    updateCall(self, info, msg) {
      info.timestamp = new Date().getTime();
      info.time = self.ts2time(new Date().getTime());
      info.status = "new";
      info.queue = msg.data.callerId.name;
      info.answered = "";
      // callid
      info.callid = self.nextCallId;

      self.$store.commit("pushCall", info);
    },
    authorize() {
      var self = this;
      // dispatch or commit ?
      self.$store.commit("authorize");

      Oyatel.Events.subscribe("/events/presence", function(msg) {
        let data = msg.data;
        if (data.event == "fulldump") {
          for (let event in data.events) {
            self.$store.commit("statusUpdate", data.events[event]);
          }
        } else {
          self.$store.commit("statusUpdate", data);
        }
      });

      Oyatel.User.currentUser(function(user) {
        self.$store.commit("updateCurrentUser", user);
      });

      Oyatel.Events.subscribe("/events/queue", function(msg) {
        if (msg.data.queueId == "que0110312") {
          //Filter on Support NO queue only!
          self.$store.dispatch("agentsBusy", msg.data.agentsBusy);
          self.$store.dispatch("agentsOnline", msg.data.agentsOnline);
          self.$store.dispatch("callsAbandoned", msg.data.callsAbandoned);
          self.$store.dispatch("callsCompleted", msg.data.callsCompleted);
          self.$store.dispatch("callsWaiting", msg.data.callsWaiting);
        }
      });

      Oyatel.Events.subscribe("/events/call", function(msg) {
        // Support NO in
        // Partner norge out or others out
        //add queue filter
        // let bool = true;

        // if (self.callExist(msg.data)) {
        //   bool = false;
        // } else {
        //   self.nextCallId++;
        //   self.callid.push(msg.data.id);
        //   self.log.push(msg.data);
        // }

        let originalCallName = msg.data.callerId.name;
        // checks if user is in support array
        if (self.support.some(el => el.id == msg.data.userId)) {
          // direction -> not working
          if (
            msg.data.direction === "out" ||
            msg.data.callerId.name === "Partner Norge"
          ) {
            // take time on outgoing calls ?
            console.log("outgoing call - app.vue events/call");
          }

          if (msg.data.direction === "in") {
            if (self.callWaiting.some(el => el == msg.data.callerId.number)) {
              console.log("duplicate");
            } else {
              self.$store.commit("pushCallWaiting", msg.data.callerId.number);
              //self.callerNum.push(msg.data.callerId.callerNum)

              let info = {
                userid: "",
                name: "",
                address: "",
                zipcode: "",
                city: "",
                country: "",
                number: "",
                queue: ""
              };

              if (msg.data.event == "ring") {
                // check local data first?
                Oyatel.Call.numberInfo(msg.data.callerId.number, function(
                  data
                ) {
                  if (data.matches.length > 0) {
                    //console.log(data.matches.length + " amount of matches - app.vue Oyatel.Call.numberInfo")
                    if (data.matches[0].name != null) {
                      info.name = data.matches[0].name;
                    }
                    if (data.matches[0].address != null) {
                      info.address = data.matches[0].address;
                    }
                    if (data.matches[0].zipcode != null) {
                      info.zipcode = data.matches[0].zipcode;
                    }
                    if (data.matches[0].city != null) {
                      info.city = data.matches[0].city;
                    }
                  }
                  if (data.location != null) {
                    info.country = data.location;
                  }
                  // all calls
                  // if (msg.data.userId == self.$store.currentUser.id) {
                  info.number = msg.data.callerId.number;
                  // info.userid = msg.data.userId

                  self.$store.commit("updateCaller", info);
                  self.updateCall(self, info, msg);
                  // }
                });
              } else if (msg.data.event == "hangup") {
                // console.log("hangup")
              } else {
                console.log("other status " + msg.data);
              }
            }
          }
        }
      });
    },
    login() {
      Oyatel.authorize();
    },
    logout() {
      Oyatel.deauthorize();
    },
    init() {
      var self = this;
      Oyatel.init(
        "7660F6FB-418F-44F4-B1F3-F6CB2F7B0223",
        "https://24soya.netlify.com/oauth_cb.html"
      );
      Oyatel.bind("authorized", function() {
        self.authorize();
      });
      Oyatel.bind("authorizationfailed", function(errormsg) {
        console.log(
          "The user rejected the authorization, or some error occured: " +
            errormsg
        );
      });
      Oyatel.bind("deauthorized", function() {
        self.$store.commit("deauthorize");
      });
      Oyatel.checkAuthorization();
      self.authorize();
    }
  },
  mounted() {
    this.init();
    this.$store.dispatch("addSupport");

    if (localStorage.call) {
      this.call = localStorage.call;
    }
  },
  watch: {},
  computed: {
    isAuthenticatedFB() {
      return this.$store.getters.isAuthenticatedFB;
    },
    ...mapGetters([
      "documentTitle",
      "supportOnline",
      "currentUser",
      "call",
      "callWaiting",
      "support"
    ])
  }
};
</script>

<style>
#app {
  background-color: #828282;
  font-family: Roboto, sans-serif;
}
</style>