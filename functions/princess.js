const fetch = require('node-fetch');
const moment = require('moment');

module.exports = {
  async searchLounge(name){
    const response = await fetch(`https://api.matsurihi.me/mltd/v1/lounges/search?name=${encodeURI(name)}`);
    const resData = await response.json();
    return resData;
  },
  async getLoungeData(loungeId){
    const response = await fetch(`https://api.matsurihi.me/mltd/v1/lounges/${loungeId}?prettyPrint=false`);
    const resData = await response.json();
    return resData;
  },
  async getLoungeHistory(loungeId){
    const response = await fetch(`https://api.matsurihi.me/mltd/v1/lounges/${loungeId}/eventHistory?prettyPrint=false`);
    const resData = await response.json();
    return resData;
  },
  async getLoungePoints(loungeId, eventId){
    const response = await fetch(`https://api.matsurihi.me/mltd/v1/events/${eventId}/rankings/logs/loungePoint/${loungeId}?prettyPrint=false`);
    const resData = await response.json();
    return resData;
  }
}