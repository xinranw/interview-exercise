const moment = require('moment')

class Utils {
  static parseDateString(dateStr) {
    return moment(dateStr, 'YYYY-MM-DD HH:mm:ss.SSSSSS ZZ').toDate()
  }
}

module.exports = Utils
