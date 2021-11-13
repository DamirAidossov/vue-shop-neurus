export default (function() { //generating exit/entry to shop event
    var nextId = 4757;
  
     return function shopEvent(actionType, sessionId) {
        this.timestamp = Date.now()/1000,
        this.id= nextId++,
        this.type= actionType,
        this.sessionId= sessionId
     }
})();