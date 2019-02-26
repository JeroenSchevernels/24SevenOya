import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    callId: 0,
    agents:[],
    callswaiting: [],
    callsTaken:[]
  }, 
  getters: {
    callLog: state => {
      return state.callsTaken
    }
  },
  mutations: {
    incrementCallId (state, agent) {
      console.log("test")
      state.callId++
      state.agents.push(agent)
    },
    callWaiting (state, call){
      state.callswaiting.push(call)
    },
    callTaken (state, agent){

    }
  },
  actions: {
    
  }
})
