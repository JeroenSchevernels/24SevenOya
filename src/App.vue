<template>
  <div id="app">
      <title>{{documentTitle}}</title>
    <v-app :dark.sync="dark">
      <v-navigation-drawer app dark>
        <v-layout column fill-height>
          <v-list>
            <v-list-item>
              <v-list-item-title class="title">
                24SOya
              </v-list-item-title>
            </v-list-item>
            <v-list-item to="/home">
              <v-list-item-title>
                Dashboard
              </v-list-item-title>
              <v-list-item-action>
                <v-icon large>dashboard</v-icon>
              </v-list-item-action>
            </v-list-item>
            <v-list-item v-if="dev" :href="getLostCalls" target="blank">
              <v-list-item-title>Lost calls</v-list-item-title>
              <v-list-item-action>
                <v-icon large>link</v-icon>
              </v-list-item-action>
            </v-list-item>
            <v-list-item to="/changelog">
              <v-list-item-title>
                Changelog
              </v-list-item-title>
              <v-list-item-action>
                <v-icon large>info</v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-spacer></v-spacer>
          <v-list>
              <v-list-item v-if="$store.state.authorized" @click="logout">
                <v-list-item-title>Logout from Oyatel</v-list-item-title>
              </v-list-item>
              <v-list-item v-if="!$store.state.authorized" @click="login">
                <v-list-item-title>
                  Login with Oyatel
                </v-list-item-title>
              </v-list-item>
          </v-list>
        </v-layout>
      </v-navigation-drawer>
      <v-content>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    name: "app",
    components: {},
    data: () => ({
      expandLogin: true,
      expandReport: false,
      dev: false,
      dark: false,
      showMenu: true,
      showCallLog: true,
      showCaller: true,
      showWaiting: true,
      showCallsToday: true,
      showAgents: true,
      precallid: "",
      nextCallId: 1,
      supportNumbers: [
        '+4724700000',
        '<unknown>'
      ],
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
    }),
    methods: {
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

        Oyatel.Events.subscribe("/events/presence", function (msg) {
          let data = msg.data;

          if (data.event == "fulldump") {
            for (let event in data.events) {
              self.$store.commit("statusUpdate", data.events[event]);
            }
          } else {
            self.$store.commit("statusUpdate", data);
          }
        });

        Oyatel.User.currentUser(function (user) {
          self.$store.commit("updateCurrentUser", user);
        });

        Oyatel.Events.subscribe("/events/queue", function (msg) {
          if (msg.data.queueId == "que0110312") {
            //Filter on Support NO queue only!
            self.$store.dispatch("agentsBusy", msg.data.agentsBusy);
            self.$store.dispatch("agentsOnline", msg.data.agentsOnline);
            self.$store.dispatch("callsAbandoned", msg.data.callsAbandoned);
            self.$store.dispatch("callsCompleted", msg.data.callsCompleted);
            self.$store.dispatch("callsWaiting", msg.data.callsWaiting);
          }
        });

        Oyatel.Events.subscribe("/events/call", function (msg) {
          console.dir(msg.data);
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

          // let originalCallName = msg.data.callerId.name;
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
                //console.log("duplicate");
              } else {
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

                if (self.supportNumbers.findIndex(e => e == msg.data.callerId.number) == -1) {
                  self.$store.commit("pushCallWaiting", msg.data.callerId.number)

                  if (msg.data.event == "ring") {
                    // check local data first?
                    // console.log(supportNumbers.findIndex(msg.data.callerId.number))
                    // if(supportNumbers.findIndex(msg.data.callerId.number) == -1){
                    Oyatel.Call.numberInfo(msg.data.callerId.number, function (data) {
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

                      info.number = msg.data.callerId.number;
                      if (msg.data.userId == self.$store.currentUser.id) {
                        // info.userid = msg.data.userId

                        self.$store.commit("updateCaller", info); // caller Info
                      }
                        self.updateCall(self, info, msg); // call log
                      // }
                    });
                  } else if (msg.data.event == "hangup") {
                    console.log("hangup")
                    console.log(msg.data.callerId.number)
                  } else {
                    console.log("other status " + msg.data);
                  }
                  // }else{
                  //   console.log("Someone called out")
                  // }
                } else {
                  self.$store.commit("pushOutgoing")
                  console.log("does exist in the array ->")
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
        Oyatel.bind("authorized", function () {
          self.authorize();
        });
        Oyatel.bind("authorizationfailed", function (errormsg) {
          console.log(
            "The user rejected the authorization, or some error occured: " +
            errormsg
          );
        });
        Oyatel.bind("deauthorized", function () {
          self.$store.commit("deauthorize");
        });
        Oyatel.checkAuthorization();
        self.authorize();
      }
    },
    beforeMount() {
      let bundle = document.createElement('script')
      bundle.setAttribute('type', 'text/javascript')
      bundle.setAttribute('src', './src/js/bundle.js')
      document.head.appendChild(bundle)
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
      getLostCalls() {
        let baseURL = "https://webapp.oyatel.com/stats?timeframe=week&date_start="
        let date = new Date
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let queue = "01"
        let seconds = "120"

        return baseURL + year + "-" + month + "-" + day + "&queue=" + queue + "&answer_seconds=" + seconds
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