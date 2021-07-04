/*
 * File: HomeMaticVariableAlarmAccessory.js
 * Project: hap-homematic
 * File Created: Thursday, 21st May 2020 5:18:55 pm
 * Author: Thomas Kluge (th.kluge@me.com)
 * -----
 * The MIT License (MIT)
 *
 * Copyright (c) Thomas Kluge <th.kluge@me.com> (https://github.com/thkl)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * ==========================================================================
 */

const path = require('path')
const HomeMaticAccessory = require(path.join(__dirname, 'HomeMaticAccessory.js'))

class HomeMaticVariableAlarmAccessory extends HomeMaticAccessory {
  publishServices(Service, Characteristic) {
    let self = this
    // get mapping
    this.mapping = {
      0: self.getDeviceSettings().STAY_ARM || 0,
      1: self.getDeviceSettings().AWAY_ARM || 1,
      2: self.getDeviceSettings().NIGHT_ARM || 2,
      3: self.getDeviceSettings().DISARMED || 3,
      4: self.getDeviceSettings().ALARM_TRIGGERED || 4
    }

    let armingDelay = self.getDeviceSettings().ARMING_DELAY || 0

    let currentStates = []
    let targetStates = []
    Object.keys(self.mapping).map((key) => {
      if (parseInt(self.mapping[key]) !== -1) {
        currentStates.push(parseInt(key))
        if (key !== 4) {
          targetStates.push(parseInt(key))
        }
      }
    })
    this.debugLog('cStates %s, tStates %s', JSON.stringify(currentStates), JSON.stringify(targetStates))
    this.alarmType = 0
    this.sensor = this.getService(Service.SecuritySystem)
    this.alarmTypeCharacteristics = this.sensor.getCharacteristic(Characteristic.SecuritySystemAlarmType)
      .on('get', (callback) => {
        callback(null, self.alarmType)
      })
      .updateValue(self.alarmType, null)

    this.currentState = this.sensor.getCharacteristic(Characteristic.SecuritySystemCurrentState)
      .on('get', (callback) => {
        let result = 0
        self._ccu.getVariableValue(self.nameInCCU).then((newValue) => {
          Object.keys(self.mapping).map((key) => {
            if (parseInt(newValue) === self.mapping[key]) {
              result = key
            }
          })
          if (callback) {
            callback(null, result)
          }
        })
      })
    this.currentState.eventEnabled = true
    this.currentState.setProps({
      format: Characteristic.Formats.UINT8,
      perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY],
      validValues: currentStates
    })

    this.targetState = this.sensor.getCharacteristic(Characteristic.SecuritySystemTargetState)
      .on('get', (callback) => {
        let result = 0
        self._ccu.getVariableValue(self.nameInCCU).then((newValue) => {
          Object.keys(self.mapping).map((key) => {
            if (parseInt(newValue) === self.mapping[key]) {
              result = key
            }
          })
          if (callback) {
            callback(null, result)
          }
        })
      })
      .on('set', (newValue, callback) => {
        // get the hm value
        let hmValue = self.mapping[parseInt(newValue)]
        self.debugLog('set %s will be mapped to %s', newValue, hmValue)
        let delay = 250 // we have also delay the requery
        if (newValue === 1) { // Only set this on ARM_AWAY
          delay = delay + (armingDelay * 1000) // Add the seconds to the requery delay
          self.debugLog('Will delay arming for about %s seconds', armingDelay)
          setTimeout(() => { // setup a timer
            self._ccu.setVariable(self.nameInCCU, hmValue)
          }, armingDelay * 1000)
          // Set Target to new Value so the control in HK will not flip back
          self.updateCharacteristic(self.targetState, newValue) // ok it will flip back on requery 
        } else {
          self._ccu.setVariable(self.nameInCCU, hmValue)
        }

        setTimeout(() => {
          self.updateVariable()
        }, delay)
        if (callback) {
          callback()
        }
      })
    this.targetState.eventEnabled = true

    this.targetState.setProps({
      format: Characteristic.Formats.UINT8,
      perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY],
      validValues: targetStates
    })

    this.registerAddressForEventProcessingAtAccessory(this.buildAddress(this.nameInCCU), (newValue) => {
      let result = false
      Object.keys(self.mapping).map((key) => {
        if (parseInt(newValue) === self.mapping[key]) {
          result = parseInt(key)
        }
      })
      self.debugLog('updateVariable HM is %s HK %s', newValue, result)

      if (result !== false) {
        if (result !== 4) {
          // target state triggered is not allowed
          this.targetState.updateValue(result, null)
          this.alarmType = 0
        } else {
          // on Alarm send the type
          this.alarmType = 1
          self.debugLog('trigger a alarm')
        }
        setTimeout(() => {
          self.currentState.updateValue(result, null)
        }, 100)
        this.alarmTypeCharacteristics.updateValue(this.alarmType)
      }
    })
  }

  async updateVariable() {

  }

  static channelTypes() {
    return ['VARIABLE']
  }

  static configurationItems() {
    return {
      'STAY_ARM': {
        type: 'number',
        default: 0,
        label: 'Value for stay',
        hint: 'The value of your HomeMatic variable when it says you are at home. Set it to -1 if you do not want this state.',
        mandatory: false
      },
      'AWAY_ARM': {
        type: 'number',
        default: 1,
        label: 'Value for away',
        hint: 'The value of your HomeMatic variable when it says you are away. Set it to -1 if you do not want this state.',
        mandatory: false
      },
      'NIGHT_ARM': {
        type: 'number',
        default: 2,
        label: 'Value for night',
        hint: 'The value of your HomeMatic variable when it says your home internal secured. Set it to -1 if you do not want this state.',
        mandatory: false
      },
      'DISARMED': {
        type: 'number',
        default: 3,
        label: 'Value for disarmed',
        hint: 'The value of your HomeMatic variable when it says the alarm system is off. Set it to -1 if you do not want this state.',
        mandatory: false
      },
      'ALARM_TRIGGERED': {
        type: 'number',
        default: 4,
        label: 'Value for alarm',
        hint: 'The value of your HomeMatic variable when all the red lights are flashing. Set it to -1 if you do not want this state.',
        mandatory: false
      },
      'ARMING_DELAY': {
        type: 'number',
        default: 0,
        label: 'Delay the arming',
        hint: 'Delay the arming by X seconds. The Arming will be set x seconds after Homekit gets the command.'
      }
    }
  }

  static serviceDescription() {
    return 'This service provides a alarm system based on a variable'
  }

  static validate(configurationItem) {
    return false
  }
}

module.exports = HomeMaticVariableAlarmAccessory
