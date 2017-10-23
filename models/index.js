const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Utils = require('./../utils')

const SiteSchema = Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  compliance: {
    value: { type: Boolean, default: true },
    lastUpdated: { type: Date, default: null }
  },
  alarms: [{
    name: { type: String, required: true },
    severity: {
      type: String,
      enum: ['Low', 'High'],
      required: true
    },
    date: { type: Date, default: Date.now }
  }],
  tanks: [{
    name: { type: String, required: true },
    leaking: { type: Boolean, default: false },
    leakStatusDate: { type: Date, default: Date.now }
  }]
}, {
  toJSON: {
    transform: (doc, ret) => {
      return {
        id: ret._id,
        name: ret.name,
        compliance: ret.compliance
      }
    }
  }
})

const SiteModel = mongoose.model('SiteModel', SiteSchema)

class Site {
  constructor(name, alarms, tanks, compliant) {
    this.name = name
    this.alarms = alarms
    this.tanks = tanks
    this.compliant = compliant
  }

  static parse(site) {
    const alarms = site.alarms.map(alarm => {
      return {
        name: alarm.name,
        severity: alarm.severity,
        alarmDate: Utils.parseDateString(alarm.alarmDate)
      }
    })
    const tanks = site.tanks.map(tank => {
      return {
        name: tank.name,
        leaking: tank.leaking,
        leakStatusDate: Utils.parseDateString(tank.leakStatusDate)
      }
    })
    const compliance = {
      value: tanks.map(tank => tank.leaking).some(leaking => leaking === true),
      lastUpdated: null
    }
    const siteModelData = {
      name: site.name,
      compliance: compliance,
      alarms: alarms,
      tanks: tanks
    }
    return new SiteModel(siteModelData)
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
  Tank,
  SiteModel
}
