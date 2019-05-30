const fetch = require('node-fetch');

module.exports = {
  async searchLounge(name) {
    const response = await fetch(`https://api.matsurihi.me/mltd/v1/lounges/search?name=${encodeURI(name)}`);
    const resData = await response.json();
    return resData;
  },
  async getLoungeData(loungeId) {
    const response = await fetch(`https://api.matsurihi.me/mltd/v1/lounges/${loungeId}?prettyPrint=false`);
    const resData = await response.json();
    return resData;
  },
  async getLoungeHistory(loungeId) {
    const response = await fetch(`https://api.matsurihi.me/mltd/v1/lounges/${loungeId}/eventHistory?prettyPrint=false`);
    const resData = await response.json();
    return resData;
  },
  async getLoungePoints(loungeId, eventId) {
    const response = await fetch(
      `https://api.matsurihi.me/mltd/v1/events/${eventId}/rankings/logs/loungePoint/${loungeId}?prettyPrint=false`
    );
    const resData = await response.json();
    return resData;
  },
  async getCurrentEvent() {
    let now = new Date();
    now.setHours(now.getHours() + 9);
    return fetch(`https://api.matsurihi.me/mltd/v1/events?at=${now}?prettyPrint=false`)
      .then(res => res.json())
      .then(res => res[0]);
  },
  async getSummaryCounts(eventId, type) {
    return fetch(`https://api.matsurihi.me/mltd/v1/events/${eventId}/rankings/summaries/${type}?prettyPrint=false`)
      .then(res => res.json())
      .then(res => res[res.length - 1]);
  },
  async getBorders(eventId, type, tiers) {
    return fetch(
      `https://api.matsurihi.me/mltd/v1/events/${eventId}/rankings/logs/${type}/${tiers}?prettyPrint=false`
    ).then(res => res.json());
  }
};
