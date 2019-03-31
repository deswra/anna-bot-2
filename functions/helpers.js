const moment = require('moment');

module.exports = {
  eventDuration(a, b) {
    let duration = moment.duration(a - b);
    let months = Math.floor(duration.asMonths());
    let days = duration.days();
    let hours = duration.hours();
    let minutes = duration.minutes();
    let seconds = duration.seconds();
    let response = '';
    if (months > 0) {
      response += `${months} month`;
      if (months > 1) {
        response += 's ';
      } else {
        response += ' ';
      }
    }
    if (days > 0) {
      response += `${days} day`;
      if (days > 1) {
        response += 's ';
      } else {
        response += ' ';
      }
    }
    if (months == 0) {
      if (hours > 0) {
        response += `${hours} hour`;
        if (hours > 1) {
          response += 's ';
        } else {
          response += ' ';
        }
      }
    }
    if (months == 0 && days == 0) {
      if (minutes > 0) {
        response += `${minutes} minute`;
        if (minutes > 1) {
          response += 's ';
        } else {
          response += ' ';
        }
      }
    }
    if (months == 0 && days == 0 && hours == 0) {
      if (seconds > 0) {
        response += `${seconds} second`;
        if (seconds > 1) {
          response += 's ';
        } else {
          response += ' ';
        }
      }
    }
    return response.slice(0, -1);
  }
}