const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')

const Utils = require('./../utils')

var SiteSchema = Schema({
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
  strict: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      return {
        id: ret._id,
        name: ret.name,
        compliant: ret.compliant,
        complianceUpdated: ret.complianceUpdated
      }
    }
  }
})
SiteSchema.virtual('compliant').get(function() {
  if (this.compliance.lastUpdated) {
    return this.compliance.value
  } else {
    return Site._getCompliance(this.tanks, this.alarms)
  }
})
SiteSchema.virtual('complianceUpdated').get(function() {
  return this.compliance.lastUpdated !== null
})
SiteSchema.plugin(uniqueValidator)

const SiteModel = mongoose.model('SiteModel', SiteSchema)

class Site {
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
      value: Site._getCompliance(tanks, alarms),
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

  static _getCompliance(tanks, alarms) {
    const existsLeakingTanks = 
      tanks.some(tank => tank.leaking === true)
    const existsHighSeverityAlarms =
      alarms.some(alarm => alarm.severity === 'High')
    return !(existsLeakingTanks || existsHighSeverityAlarms)
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
  Tank,
  SiteModel
}
