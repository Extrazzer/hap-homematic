const assert = require('assert')
const path = require('path')
const Logger = require(path.join(__dirname, '..', 'lib', 'logger.js'))
const Server = require(path.join(__dirname, '..', 'lib', 'Server.js'))
const Service = require('hap-nodejs').Service
const Characteristic = require('hap-nodejs').Characteristic
const expect = require('expect.js')

const fs = require('fs')
let log = new Logger('HAP Test')
log.setDebugEnabled(false)

const testCase = 'HmIP-DLD.json'

describe('HAP-Homematic Tests ' + testCase, () => {
  let that = this

  before(async () => {
    log.debug('preparing tests')
    let datapath = path.join(__dirname, 'devices', testCase)
    let strData = fs.readFileSync(datapath).toString()
    if (strData) {
      that.data = JSON.parse(strData)

      that.server = new Server(log)

      await that.server.simulate(undefined, {
        config: {
          channels: Object.keys(that.data.ccu)
        },
        devices: that.data.devices
      })
    } else {
      assert.ok(false, 'Unable to load Test data')
    }
  })

  after(() => {
    Object.keys(that.server._publishedAccessories).map(key => {
      let accessory = that.server._publishedAccessories[key]
      accessory.shutdown()
    })
  })

  it('HAP-Homematic check test mode', (done) => {
    expect(that.server.isTestMode).to.be(true)
    done()
  })

  it('HAP-Homematic check number of ccu devices', (done) => {
    expect(that.server._ccu.getCCUDevices().length).to.be(1)
    done()
  })

  it('HAP-Homematic check number of mappend devices', (done) => {
    expect(Object.keys(that.server._publishedAccessories).length).to.be(1)
    done()
  })

  it('HAP-Homematic check assigned services', (done) => {
    Object.keys(that.server._publishedAccessories).map(key => {
      let accessory = that.server._publishedAccessories[key]
      expect(accessory.serviceClass).to.be(that.data.ccu[accessory.address()])
    })
    done()
  })

  it('HAP-Homematic check LOCK_STATE 0 Cur sould be UNSECURED', (done) => {
    that.server._ccu.fireEvent('HmIP.7316163726ABCD:1.LOCK_STATE', 0)
    let accessory = that.server._publishedAccessories[Object.keys(that.server._publishedAccessories)[0]]
    let service = accessory.getService(Service.LockMechanism, 'TestDevice', false, '', true)
    assert.ok(service, 'LockMechanism Service not found')
    let ch = service.getCharacteristic(Characteristic.LockCurrentState)
    assert.ok(ch, 'LockCurrentState State Characteristics not found')
    ch.getValue((context, value) => {
      try {
        expect(value).to.be(Characteristic.LockCurrentState.UNSECURED)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('HAP-Homematic check LOCK_STATE 1 Cur sould be LOCKED', (done) => {
    that.server._ccu.fireEvent('HmIP.7316163726ABCD:1.LOCK_STATE', 1)
    let accessory = that.server._publishedAccessories[Object.keys(that.server._publishedAccessories)[0]]
    let service = accessory.getService(Service.LockMechanism, 'TestDevice', false, '', true)
    assert.ok(service, 'LockMechanism Service not found')
    let ch = service.getCharacteristic(Characteristic.LockCurrentState)
    assert.ok(ch, 'LockCurrentState State Characteristics not found')
    ch.getValue((context, value) => {
      try {
        expect(value).to.be(Characteristic.LockCurrentState.SECURED)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('HAP-Homematic check LOCK_STATE 2 Cur sould be UNSECURED', (done) => {
    that.server._ccu.fireEvent('HmIP.7316163726ABCD:1.LOCK_STATE', 0)
    let accessory = that.server._publishedAccessories[Object.keys(that.server._publishedAccessories)[0]]
    let service = accessory.getService(Service.LockMechanism, 'TestDevice', false, '', true)
    assert.ok(service, 'LockMechanism Service not found')
    let ch = service.getCharacteristic(Characteristic.LockCurrentState)
    assert.ok(ch, 'LockCurrentState State Characteristics not found')
    ch.getValue((context, value) => {
      try {
        expect(value).to.be(Characteristic.LockCurrentState.UNSECURED)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('HAP-Homematic set LockTargetState to SECURED (-> 0 LOCKED)', (done) => {
    let accessory = that.server._publishedAccessories[Object.keys(that.server._publishedAccessories)[0]]
    let service = accessory.getService(Service.LockMechanism)
    assert.ok(service, 'LockMechanism not found')
    let chTar = service.getCharacteristic(Characteristic.LockTargetState)
    chTar.setValue(Characteristic.LockTargetState.SECURED, () => {
      setTimeout(async () => {
        let value = await that.server._ccu.getValue('HmIP.7316163726ABCD:1.LOCK_TARGET_LEVEL')
        try {
          expect(value).to.be(0)
          done()
        } catch (e) {
          done(e)
        }
      }, 15) // default delay is 500ms
    })
  })

  it('HAP-Homematic set LockTargetState to UNSECURED (-> 1 LOCKED)', (done) => {
    let accessory = that.server._publishedAccessories[Object.keys(that.server._publishedAccessories)[0]]
    let service = accessory.getService(Service.LockMechanism)
    assert.ok(service, 'LockMechanism not found')
    let chTar = service.getCharacteristic(Characteristic.LockTargetState)
    chTar.setValue(Characteristic.LockTargetState.UNSECURED, () => {
      setTimeout(async () => {
        let value = await that.server._ccu.getValue('HmIP.7316163726ABCD:1.LOCK_TARGET_LEVEL')
        try {
          expect(value).to.be(1)
          done()
        } catch (e) {
          done(e)
        }
      }, 15) // default delay is 500ms
    })
  })

})
