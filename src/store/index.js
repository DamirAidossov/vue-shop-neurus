import { createStore } from 'vuex'
import shopEvent from '../functions/eventClass'
import trunstileEvent from '../functions/trunstileEventClass'
import getSessions from '../functions/getSessions'

let data = getSessions();
export default createStore({
  state () {
    return {
      sessions: data.sessions,
      items: data.items
    }
  },
  mutations: {
    addevent (state, data) {//create shop event
      let newEvent = new shopEvent(data.productName, data.actionType, data.count, data.sessionId)
      state.sessions[data.sessionId].events.push(newEvent)
    },
    changeSessionState (state, data){//close session
      if (state.sessions[data.sessionId].isActive){
        state.sessions[data.sessionId].isActive = false
        let newEvent = new trunstileEvent('exit', data.sessionId)
        state.sessions[data.sessionId].trunstile_events.push(newEvent)
        state.sessions[data.sessionId].endTime = newEvent.timestamp
      } 
    }
  },
  actions:{
    addItemToBasket(ctx, data){
      return new Promise((resolve) => {
        ctx.commit('addevent',{
          productName: data.productName,
          actionType: 'take_off',
          count: data.count,
          sessionId: data.sessionId
        })
        resolve();
      })
    },
    removeItemFromBasket(ctx, data){
      return new Promise((resolve) => {
        ctx.commit('addevent',{
          productName: data.productName,
          actionType: 'put_on',
          count: data.count,
          sessionId: data.sessionId
        })
        resolve();
      })
    },
    changeSessionState(ctx, data){// close session
      return new Promise((resolve) => {
        ctx.commit('changeSessionState',{
          sessionId: data.sessionId
        })
        resolve();
      })
    }
  },
  getters:{
    getBasket : (state) => (sessionId) => {
      return state.sessions[sessionId].events.reduce((res, val)=>{
        if(!res[val.productName]){
          res[val.productName] = {
            count: val.productCount * -1
          }
        } else if(res[val.productName].count + (val.productCount * -1) == 0 ){
            delete res[val.productName]
        } else {
            res[val.productName].count = res[val.productName].count + (val.productCount * -1)
        }
        return res;
      },{})
    },
    getItems : (state, getters) => (sessionId) => {//get list of items which are not in current basket
      let basket = getters.getBasket(sessionId)
      let basketArr = Object.keys(basket)
      return state.items.reduce((res, val)=>{
          if(basketArr.indexOf(val) == -1){
            res.push(val)
          }
          return res;
      }, [])
    },
    getActiveSessions : (state) => (sessionId) =>{//get list of active session except chosen session
      let activeSessions = [];
      for(let i in state.sessions){
        if(state.sessions[i].isActive && i != sessionId ){
          activeSessions.push({name:state.sessions[i].name, id:i})
        }
      }
      
      return activeSessions;
    },
    getSessionEvents : (state) => (sessionId) =>{//get list of all event only for developer mode
      let arr = []
      for(let i in state.sessions[sessionId].events){
        let event = Object.assign({},state.sessions[sessionId].events[i])
        arr.push(event)
      }
      return arr
    }
  }
})
