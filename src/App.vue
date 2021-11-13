<template>
  <div class="container">
    <!-- button only for developer mode -->
    <button type="button" class="btn btn-warning" @click="logger()">Вывести в консоль текущий state vuex</button>
    <div class="row justify-content-around">
      <div class="col-md-6 col-xl-4 col-12 p-3" v-for="(item, index) in this.$store.state.sessions" :key="item.name">
        <sessionCard 
          :sessionId="index" 
          :name="item.name" 
          :active="item.isActive" 
          :startTime="item.startTime" 
          :endTime="item.endTime" 
          :basket="this.$store.getters.getBasket(index)"/>
      </div> 
    </div>
  </div>
  
  
</template>

<script>
import sessionCard from './components/sessionCard.vue'
export default {
  name: 'App',
  components: {
    sessionCard,
  },
  methods:{
    logger(){//function to send in console list of all events in all sessions
      for(let i in this.$store.state.sessions){
        console.log('Session id "',this.$store.state.sessions[i].name,'" events: ', this.$store.getters.getSessionEvents(i))
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
