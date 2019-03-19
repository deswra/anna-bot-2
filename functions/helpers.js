const moment = require('moment');

module.exports = {
  eventDuration(a, b) {
    let duration = moment.duration(a - b);
    let days = Math.floor(duration.asDays());
    let hours = duration.hours();
    let minutes = duration.minutes();
    let seconds = duration.seconds();
    let response = '';
    if (days > 0) {
      response += `${days} day`;
      if (days > 1) {
        response += 's ';
      } else {
        response += ' ';
      }
    }
    if (hours > 0) {
      response += `${hours} hour`;
      if (hours > 1) {
        response += 's ';
      } else {
        response += ' ';
      }
    }
    if (days == 0) {
      if (minutes > 0) {
        response += `${minutes} minute`;
        if (minutes > 1) {
          response += 's ';
        } else {
          response += ' ';
        }
      }
    }
    if (days == 0 && hours == 0) {
      if (seconds > 0) {
        response += `${seconds} second`;
        if (seconds > 1) {
          response += 's ';
        } else {
          response += ' ';
        }
      }
    }
    return response;
  }
}