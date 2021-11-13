<template> <!-- Session crad-->
  <div>
  <div v-if="active" class="container card p-0 d-flex flex-column"> <!-- If session is opened, this div will be rendered-->
    <div class="container header orange d-flex flex-row justify-content-between align-items-center p-0">
      <div class="d-flex flex-row">
        <div class="rounded-circle image d-flex flex-column justify-content-center mx-2">
          <i class="fa-solid fa-user text-white "></i>
        </div>
        <div class="d-flex flex-column justify-content-center align-items-start">
          <span >{{name}}</span>
          <span class="fs-7 text-muted">{{getDate(startTime)}} {{endTime? "- " + getDate(endTime):""}}</span>
        </div>
      </div>
      <div>
        <i class="fa-solid fa-note-sticky fa-lg text-muted"></i>
        <i class="fa-solid fa-ellipsis-vertical fa-lg text-muted px-3"></i>
      </div>
    </div>
    <div  class="container d-flex flex-row justify-content-between entry">
      <span class="text-warning fw-bolder">Вход</span>
      <span>{{getDate(startTime)}}</span>
    </div>
    <div class="overflow-auto hideScroll list">
      <ul class="list-group">
        <li class="list-group-item d-flex flex-row align-items-center" v-for="(item,index) in basket" :key="item.id">
          <span class="col-7 text-start"> {{index}} </span>
          <div class="col-5">
            <i class="fa-solid fa-trash px-2 text-danger" data-bs-toggle="modal" :data-bs-target="'#id'+name" @click="modalOpen(
              {
                text:'Удалить товар из корзины?', 
                func:removeItemFromBasket, 
                data:[index, sessionId, item.count], 
                title: 'Удалить '+ index
              })">
            </i>
            <i v-if="item.count == 1" class="fa-solid fa-minus px-2 text-muted" ></i>
            <i v-else class="fa-solid fa-minus px-2 text-primary" @click="removeItemFromBasket(index, sessionId)"></i>
            <span class="px-1">{{item.count}}</span>
            <i class="fa-solid fa-plus px-2 text-primary" @click="addItemToBasket(index, sessionId)"></i>
            <i class="fa-solid fa-arrow-right ps-2 text-primary" data-bs-toggle="modal" :data-bs-target="'#id'+name" @click="modalOpen(
              {
                text:'changeSession', 
                func: changeItemSession, 
                title:'Сменить сессию товара', 
                sessionId: sessionId,
                data: [item.count, index]
              })">
            </i>
          </div>
        </li>
      </ul>
    </div>
    <div class="container d-flex flex-row justify-content-between entry footer">
      <button type="button" class="btn btn-outline-warning" data-bs-toggle="modal" :data-bs-target="'#id'+name" @click="modalOpen(
        {
          text:'newItem', 
          func: addItemToBasket,
          title:'Add new item to Basket',
          sessionId: sessionId,
        })"
      >Добавить продукт</button>
      <button type="button" class="btn btn-warning" data-bs-toggle="modal" :data-bs-target="'#id'+name" @click="modalOpen(
        {
          text:'Вы уверены? После этого открыть сессию снова нельзя', 
          func: changeSessionState, 
          title:'Завершить сессию',
          data:[sessionId]
        })" 
      >Завершить</button>
    </div>
  </div>

  <div v-else class="container card p-0 d-flex flex-column"> <!-- If session is closed, this div will be rendered-->
    <div class="container header orange d-flex flex-row justify-content-between align-items-center p-0">
      <div class="d-flex flex-row">
        <div class="rounded-circle image d-flex flex-column justify-content-center mx-2">
          <i class="fa-solid fa-user text-white "></i>
        </div>
        <div class="d-flex flex-column justify-content-center align-items-start">
          <span >{{name}}</span>
          <span class="fs-7 text-muted">{{getDate(startTime)}} {{endTime? "- " + getDate(endTime):""}}</span>
        </div>
      </div>
      <div>
        <i class="fa-solid fa-check fa-lg px-3 text-success"></i>
      </div>
    </div>
    <div  class="container d-flex flex-row justify-content-between entry">
      <span class="text-warning fw-bolder">Вход</span>
      <span>{{getDate(startTime)}}</span>
    </div>
    <div class="overflow-auto hideScroll listInactive">
      <ul class="list-group">
        <li class="list-group-item d-flex flex-row align-items-center" v-for="(item,index) in basket" :key="item.id">
          <span class="col-7 text-start"> {{index}} </span>
          <div class="col-5 d-flex flex-row justify-content-end">
            <span class="px-1">{{item.count}}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
  
  <!-- Bootstrap hidden modal window-->
  <modal :id="'id'+name" :action="modalcb" :text="modalText" :data="modalData" :sessionId="modalSession" :title="modalTitle"></modal>
  </div>
</template>

<script>
import modal from './modal'

export default {
  name: 'sessionCard',
  props: {
    name: String,
    active: Boolean,
    startTime: Number,
    endTime: Number,
    basket: Object,
    sessionId: String,
    
  },
  data() {
    return{
      modalcb: ()=>{},
      modalText: "",
      modalData: [],
      modalTitle: "",
      modalSession:""
    }
  },
  components:{
    modal
  },
  methods:{
    getDate(time) { //function to convert unix timestamp to user friendly format
      let date = new Date(time * 1000);
      let hours = date.getHours();
      let minutes = "0" + date.getMinutes();
      let seconds = "0" + date.getSeconds();
      let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
      return formattedTime;
    },
    addItemToBasket(productName, sessionId, count){//create shop event and add products to basket
      this.$store.dispatch('addItemToBasket',{
        productName: productName,
        count: count? count : -1,
        sessionId: sessionId,
      })
    },
    removeItemFromBasket(productName, sessionId, count){//create shop event and remove products to basket
      this.$store.dispatch('removeItemFromBasket',{
        productName: productName,
        count: count? count : 1,
        sessionId: sessionId,
      })
    },
    modalOpen(data){//change parameters binded to modal window to show required information
      this.modalcb = data.func
      this.modalText = data.text
      this.modalData = data.data
      this.modalTitle = data.title
      this.modalSession = data.sessionId
    },
    changeItemSession(sessionIdTo, sessionIdfrom, count, productName){//close session and prevent changing data
      this.removeItemFromBasket(productName, sessionIdfrom, count)
      this.addItemToBasket(productName, sessionIdTo, count*-1)
    },
    changeSessionState(sessionId){
      this.$store.dispatch('changeSessionState',{
        sessionId: sessionId,
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card{
  height:400px;
  border: solid #fc8300;
}
.image{
  background-color: #fc8300;
  height: 40px;
  width: 40px;
}
.header{
  height:60px;
  background-color: #FFD580;
}
.fs-7{
  font-size:0.7rem;
}
.entry{
  padding: .5rem 1rem;
}
.hideScroll::-webkit-scrollbar{
  display: none;
}
.hideScroll {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.list{
  height: 250px;
}
.listInactive{
  height: 300px;
}
.footer{
  height: 50px;
}


</style>
