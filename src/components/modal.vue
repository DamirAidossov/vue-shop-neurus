<template> <!-- Universal modal window-->
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" 
         tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true"> 
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">{{title}}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div v-if="text == 'newItem'" class="overflow-auto hideScroll body"> <!-- Div for adding new item to basket-->
                <ul class="list-group">
                    <li class="list-group-item d-flex flex-row align-items-center" 
                        v-for="item in this.$store.getters.getItems(sessionId)" :key="item" 
                        @click="action(item, sessionId)" 
                        data-bs-dismiss="modal">
                        {{item}}
                    </li>
                </ul>
            </div>
            <div v-if="text == 'changeSession'" class="overflow-auto hideScroll"> <!-- Div for changing item session to another session-->
                <span>Choose session to transfer product</span>
                <ul class="list-group">
                    <li class="list-group-item d-flex flex-row align-items-center" 
                        v-for="item in this.$store.getters.getActiveSessions(sessionId)" :key="item" 
                        @click="action(item.id, sessionId, ...data)" data-bs-dismiss="modal">
                        <span>{{item.name}}</span>
                    </li>
                </ul>
            </div>
            <span v-if="text!='changeSession' && text!='newItem'">{{text}}</span> 
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="action(...data)" >Принять</button>
        </div>
        </div>
    </div>
    </div>
</template>

<script>

export default {
  name: 'modal',
  props: {
    text: String,
    action: Function,
    data: Array,
    title: String,
    sessionId: String,
  }
}
</script>

<style scoped>

.body{
    height: 300px;
}
</style>
