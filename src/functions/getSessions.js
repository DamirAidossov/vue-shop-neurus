import events from '../data/events.json'
import trunstile_events from '../data/trunstile-events.json'



export default function(){//group all events by sessionId and create list of all items
    let sessions = {}
    let items = []
    for(let i in trunstile_events){
      if(!sessions[trunstile_events[i]['sessionId']]){
        sessions[trunstile_events[i]['sessionId']] = {events:[], trunstile_events:[], isActive: true}
      }
      if(trunstile_events[i].type == 'open'){
        sessions[trunstile_events[i]['sessionId']].name = (trunstile_events[i].id).toString();
        sessions[trunstile_events[i]['sessionId']].startTime = trunstile_events[i].timestamp
      } else if(trunstile_events[i].type == 'exit'){
        sessions[trunstile_events[i]['sessionId']].isActive = false
        sessions[trunstile_events[i]['sessionId']].endTime = trunstile_events[i].timestamp
      }
      sessions[trunstile_events[i]['sessionId']].trunstile_events.push(trunstile_events[i])
    }
    for(let i in events){
      if(sessions[events[i]['sessionId']]){
        sessions[events[i]['sessionId']].events.push(events[i])
      } else {
        console.log('found event without valid sessionId')
      }
      if(items.indexOf(events[i]['productName']) == -1){
        items.push(events[i]['productName'])
      }
    }

    return {sessions: sessions, items: items};
}