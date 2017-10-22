class Site {
  constructor(name, alarms, tanks, compliant) {
    this.name = name
    this.alarms = alarms
    this.tanks = tanks
    this.compliant = compliant
  }
}

class Alarm {
  constructor(name, severity, date) {
    this.name = name
    this.severity = severity
    this.date = date
  }
}

class Tank {
  constructor(name, leaking, leakStatusDate) {
    this.name = name
    this.leaking = leaking
    this.leakStatusDate = leakStatusDate
  }
}

module.exports = {
  Site,
  Alarm,
  Tank
}
