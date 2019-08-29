import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

class Support {
  constructor(id, name, avatar = "") {
    this.id = id
    this.name = name
    this.status = 'UNAVAILABLE'
    this.outgoingCalls = 0
    this.incomingCalls = 0
    this.avatar = avatar
    this.callid = ''
    this.originalCallName = ''
    this.details = false
  }
}

export default new Vuex.Store({
  state: {
    callId: 0,
    agents: [],
    callsTaken: [],
    support: [],
    displayOption:{ //to be implemented
      showMenu: false,
      showCallLog: true,
      showCaller: true,
      showWaiting: true,
      showCallsToday: true,
      showAgents: true
    },
    documentTitle: '24Soya',
    authorized: true,
    currentUser: {},
    abandoned: 0,
    precallid: '',
    caller: {
      name: '', //lookup name
      number: '', // actual number from the API
      address: '', // lookup address 
      city: '',
      zipcode: '',
      country: '',
      id: ''
    },
    callid: [],
    nextCallId: 1,
    call: [],
    callWaiting: [],
    agentsBusy: 0,
    agentsOnline: 0,
    callsAbandoned: 0,
    callsCompleted: 0,
    callsWaiting: 0,
  },
  getters: {
    supportOnline: state => {
      return state.support.filter(agent => agent.status != "UNAVAILABLE" || agent.incomingCalls > 0) // viser antallsamtaler som bruker tok etter at bruker har logget av.
    },
    documentTitle: state => {
      return 'Wait: ' + state.callsWaiting + ' Busy: ' + state.agentsBusy + '/' + state.agentsOnline
    },
    currentUser: state => {
      return state.currentUser.username
    },
    findIndexOfAgent: (state, id) => {
      return state.support.findIndex(x => x.id == id)
    },
    caller: state => {
      return state.caller
    },
    call: state => {
      return state.call
    },
    support: state => {
      return state.support
    },
    callWaiting: state => {
      return state.callWaiting
    },
    //remove the below ones later
    // authorized: state => {
    //   return state.authorized
    // },
    // agentsBusy: state => {
    //   return state.agentsBusy
    // },
    // agentsOnline: state => {
    //   return state.agentsOnline
    // },
    // callLog: state => {
    //   return state.callsTaken
    // },
    // callsAbandoned: state => {
    //   return state.callsAbandoned
    // },
    // callsWaiting: state => {
    //   return state.callsWaiting
    // },
    // callsCompleted: state => {
    //   return state.callsCompleted
    // }
  },
  mutations: {
    pushOutgoing(state) {
      state.outgoingCallArray.push("1")
    },
    callWaiting(state, call) {
      state.callWaiting.push(call)
    },
    authorize: state => {
      state.authorized = true
    },
    deauthorize: state => {
      state.authorized = false
    },
    initSupport: state => {
      let support = []
      support.push(new Support(21102, "Adam"))
      support.push(new Support(3199, "Adrian", "img/ao.png"))
      support.push(new Support(2944, "Andreas", "img/and.png"))
      support.push(new Support(20714, "Eirik", "img/el.png"))

      support.push(new Support(20321, "Guro"))
      support.push(new Support(19608, "Hanne"))
      support.push(new Support(3208, "Henrik"))
      support.push(new Support(2947, "Iselin"))

      support.push(new Support(21101, "Jeroen", "img/jss.png"))
      support.push(new Support(5546, "Joakim", "img/jll.png"))
      support.push(new Support(2943, "Kjerstin"))
      support.push(new Support(21100, "Konrad", "img/kga.png"))

      support.push(new Support(16518, "Petter", "img/pb.png"))
      support.push(new Support(4958, "Sonja"))
      support.push(new Support(3184, "Terje", "img/tl.png"))
      support.push(new Support(17333, "Truls", "img/trr.png")),
      support.push(new Support(21371, "Sara"))

      state.support = support
    },
    updatePresence: (state, index, status) => {
      state.support[index].state = status
    },
    agentsBusy: (state, agentsBusy) => {
      state.agentsBusy = agentsBusy
    },
    agentsOnline: (state, agentsOnline) => {
      state.agentsOnline = agentsOnline
    },
    callsAbandoned: (state, callsAbandoned) => {
      state.callsAbandoned = callsAbandoned
    },
    callsCompleted: (state, callsCompleted) => {
      state.callsCompleted = callsCompleted
    },
    callsWaiting: (state, callsWaiting) => {
      state.callsWaiting = callsWaiting
    },
    statusUpdate: (state, event) => {
      if (state.support.some(el => el.id == event.userId)) {
        let index = state.support.findIndex(x => x.id == event.userId)
        let agent = state.support[index]
        if (event.state != agent.status) {
          let previous = agent.status;
          agent.status = event.state
          if ((previous == 'RINGING') && (agent.status == 'BUSY')) {
            //if (agent.originalCallName == "Support NO") {
            let thisTime = new Date().getTime()
            let lastCall = state.callWaiting.shift()
            let indexcall = state.call.map(x => {
              return x.number
            }).lastIndexOf(lastCall)
            console.log(state.callWaiting)

            // if taken prob not right
            if (indexcall == -1) {
              state.outgoingCallArray.pop()
              agent.outgoingCalls += 1
            } else {
              agent.incomingCalls += 1
              let c = state.call[indexcall]
              c.status = 'taken'
              c.answered = agent.name
              c.timestampAnswered = thisTime
              c.timeTaken = (thisTime - c.timestamp) / 1000
              state.call.splice(indexcall, 1, c)
            }
            // }
          }
        }

      }
    },
    updateCaller: (state, caller) => {
      state.caller = caller
    },
    updateCurrentUser: (state, user) => {
      state.currentUser = user
    },
    pushCall: (state, call) => {
      state.call.push(call)
    },
    pushCallWaiting: (state, number) => {
      state.callWaiting.push(number)
    }
  },
  actions: {
    agentsBusy({
      commit
    }, agentsBusy) {
      commit('agentsBusy', agentsBusy)
    },
    agentsOnline({
      commit
    }, agentsOnline) {
      commit('agentsOnline', agentsOnline)
    },
    callsAbandoned({
      commit
    }, callsAbandoned) {
      commit('callsAbandoned', callsAbandoned)
    },
    callsCompleted({
      commit
    }, callsCompleted) {
      commit('callsCompleted', callsCompleted)
    },
    callsWaiting({
      commit
    }, callsWaiting) {
      commit('callsWaiting', callsWaiting)
    },
    authorize({
      commit
    }) {
      commit('authorize')
    },
    addSupport({
      commit
    }) {
      commit('initSupport')
    },
    updatePresence({
      commit
    }, index, status) {
      console.log(index + " " + status)
      commit('updatePresence', index, status)
    },
    // to be impelmented
    // searchInZendesk({
    //   commit
    // }) {
    //   // search in the zendesk for the last cases a user have
    // },
    // submitRequest({
    //   commit
    // }) {
    // },
  }
})
