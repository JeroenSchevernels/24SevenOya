<template>
  <div id="app">
    <v-app>
      <title>{{documentTitle}}</title>
      <v-toolbar dark>
        <!-- <v-menu v-model="showMenu" :close-on-content-click="false" :nudge-width="200" offset-x>
					<v-btn icon slot="activator">
						<v-icon large>menu</v-icon>
					</v-btn>
					<v-list>
						<v-list-tile>
							<v-list-tile-action>
								<v-switch v-model="showCallLog" color="purple"></v-switch>
							</v-list-tile-action>
							<v-list-tile-title>Enable call log</v-list-tile-title>
							<v-list-tile-action>
								<v-switch v-model="showCallsToday" color="purple"></v-switch>
							</v-list-tile-action>
							<v-list-tile-title>Enable calls today</v-list-tile-title>
							<v-list-tile-action>
								<v-switch v-model="showWaiting" color="purple"></v-switch>
							</v-list-tile-action>
							<v-list-tile-title>Enable waiting</v-list-tile-title>
							<v-list-tile-action>
								<v-switch v-model="showCaller" color="purple"></v-switch>
							</v-list-tile-action>
							<v-list-tile-title>Enable caller info</v-list-tile-title>
							<v-list-tile-action>
								<v-switch v-model="showAgents" color="purple"></v-switch>
							</v-list-tile-action>
							<v-list-tile-title>Enable agents</v-list-tile-title>
						</v-list-tile>
					</v-list>
        </v-menu>-->
        <v-toolbar-title>24SOya</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items v-if="isAuthenticatedFB">
			<v-btn flat to="/">
				<v-icon>home</v-icon>Home
			</v-btn>
			<v-btn flat to="/changelog">
				<v-icon>info</v-icon>Changelog
			</v-btn>
			<v-btn flat to="/wishlist">
				<v-icon>add_shopping_cart</v-icon>Change requests
			</v-btn>
        </v-toolbar-items>
        <v-spacer></v-spacer>
        <v-toolbar-items>
			<v-btn flat v-if="!$store.state.authorized" @click="login">Login with Oyatel</v-btn>
			<v-btn flat v-if="$store.state.authorized" @click="logout">Logout ({{currentUser}})</v-btn>
			<v-btn v-if="!isAuthenticatedFB" flat to="/join">
				<v-icon>how_to_reg</v-icon>Join Firebase
			</v-btn>
			<v-btn v-if="!isAuthenticatedFB" flat to="/signin">
				<v-icon>person</v-icon>Sign in Firebase
			</v-btn>
			<v-btn v-if="isAuthenticatedFB" flat @click="logoutFB">
				Logout Firebase
			</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <div v-if="$store.state.authorized">
        <router-view></router-view>
      </div>
	  <div v-if="!$store.state.authorized">
        <router-view to="/join"></router-view>
      </div>
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
      showMenu: false,
      showCallLog: true,
      showCaller: true,
      showWaiting: true,
      showCallsToday: true,
      showAgents: true,
      precallid: "",
      callerNum: [],
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
      this.$store.dispatch('userSignOutFB');
    },
    ts2time(number) {
      let timestamp = new Date(number);
      let hours = "0" + timestamp.getHours();
      let minutes = "0" + timestamp.getMinutes();
      // let seconds = "0" + timestamp.getSeconds();
      return hours.substr(-2) + ":" + minutes.substr(-2); //+ ':' + seconds.substr(-2);
    },
    deauthorized() {
      this.$store.commit('deauthorize')
    },
    updateCall(self, info, msg) {
      info.timestamp = new Date().getTime();
      info.time = self.ts2time(new Date().getTime());
      info.status = "new";
      info.queue = msg.data.callerId.name;
	  info.answered = "";
	  // callid
	  info.callid = self.nextCallId;
	  
	  self.$store.commit('pushCall', info)
    },
    // pushCall(call) {
    //   var self = this;
    //   self.call.push(call);
    // },
    // callExist(caller) {
    //   // checking if caller exist
    //   var self = this;
    //   for (let c in self.call) {
    //     if (caller.callerId.number == self.call[c].number) {
    //       if (self.call[c].timestamp - new Date().getTime() < 120000) {
    //         return true;
    //       }
    //     }
    //   }
    //   return false;
    // },
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
          self.$store.dispatch("agentsBusy", msg.data.agentsBusy)
          self.$store.dispatch("agentsOnline", msg.data.agentsOnline)
          self.$store.dispatch("callsAbandoned", msg.data.callsAbandoned)
          self.$store.dispatch("callsCompleted", msg.data.callsCompleted)
          self.$store.dispatch("callsWaiting", msg.data.callsWaiting)
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
          if (msg.data.direction === "out" || msg.data.callerId.name === "Partner Norge") {
            // take time on outgoing calls ?
            console.log("outgoing call - app.vue events/call")
          }

          if (msg.data.direction === "in") {
            if(self.callerNum.some(el => el.id == msg.data.callerId.number)){
              console.log("duplicate")
            }else{
              self.callerNum.push(msg.data.callerId.callerNum)

              let info = {
                userid: "",
                name: "",
                address: "",
                zipcode: "",
                city: "",
                country: "",
                number: "",
                queue: ""
              }
              
              if (msg.data.event == "ring") {
                // check local data first?
                Oyatel.Call.numberInfo(msg.data.callerId.number, function(data) {
                  if (data.matches.length > 0) {
                    //console.log(data.matches.length + " amount of matches - app.vue Oyatel.Call.numberInfo")
                    if (data.matches[0].name != null){
                      info.name = data.matches[0].name
                    }
                    if (data.matches[0].address != null){
                      info.address = data.matches[0].address
                    }
                    if (data.matches[0].zipcode != null){
                      info.zipcode = data.matches[0].zipcode
                    }
                    if (data.matches[0].city != null){
                      info.city = data.matches[0].city
                    }
                  }
                  if (data.location != null) {
                    info.country = data.location
                  }
                  
                  // all calls
                  // if (msg.data.userId == self.$store.currentUser.id) {
                  info.number = msg.data.callerId.number
                  // info.userid = msg.data.userId
                  self.$store.commit("updateCaller", info)
                  self.updateCall(self, info, msg)
                  // }
                });
              } else if (msg.data.event == "hangup") {
                // console.log("hangup")
              } else {
                console.log("other status " + msg.data)
              }
                // for (let id in self.support) {
                  //   if (self.support[id].status != "BUSY" && self.support[id].id == msg.data.userId) {
                    //     self.support[id].callid = self.nextCallId;
                //     self.support[id].originalCallName = originalCallName;
                //   }
                // }

                //   if (self.call.length > 0) {
                  //     if (self.call[self.call.length - 1].number === msg.data.callerId.number) { 
                    //       // check if phone number is the same as the previous one
                //       if (new Date().getTime() - self.call[self.call.length - 1].timestamp < 120000) {
                  //         //less than 2 minutes since last, so we assume same call
                //         self.call[self.call.length - 1].timestamp = new Date().getTime()
                //         self.call[self.call.length - 1].time = self.ts2time(new Date().getTime())
                //       } else {
                  //         //same number, but longer than 2 minutes ago
                //         self.updateCall(self, info, msg);
                //       }
                //     } else {
                  //       //previous number not the same as the current // true
                //       self.updateCall(self, info, msg);
                //     }
                //   } else {
                  //     //no call in list yet
                //     self.updateCall(self, info, msg);
                //   }
                //   //self.updateCall();
                //   // hangup
                //   console.log("please make me");
                //   alert("other status: " + msg.data);
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
	...mapGetters(["documentTitle", "supportOnline", "currentUser", "call", "support"])
  }
};
</script>

<style>
#app {
  background-color: #828282;
  font-family: Roboto, sans-serif;
}
</style>