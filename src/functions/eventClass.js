export default (function() { //generating shop event (removing, placing products)
    var nextId = 111128;
  
     return function shopEvent(productName, actionType, count, sessionId) {
        this.timestamp = Date.now()/1000,
        this.productName = productName,
        this.id= nextId++,
        this.type= actionType,
        this.productCount= count,
        this.sessionId= sessionId
     }
})();