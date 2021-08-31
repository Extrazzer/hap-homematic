/*
 * File: HomeMaticVariableNumberSensorAccessory.js
 * Project: hap-homematic
 * File Created: Friday, 12th June 2020 8:20:06 pm
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
const EveHomeKitWeatherTypes = require(path.join(__dirname, 'EveWeather.js'))

module.exports = class HomeMaticVariableNumberSensorAccessory extends HomeMaticAccessory {
  publishServices(Service, Characteristic) {
    let self = this

    if (((this.variable.valuetype === 4) || (this.variable.valuetype === 16)) && (this.variable.subtype === 0)) {
      this.subType = this.getDeviceSettings().Type || 'Lightbulb'
      this.homeKitState = 0

      switch (this.subType) {
        case 'Lightbulb':
          this.service = this.getService(Service.Lightbulb)
          this.char = this.service.getCharacteristic(Characteristic.Brightness)
          this.active = this.service.getCharacteristic(Characteristic.StatusActive)

          this.isOnCharacteristic = this.service.getCharacteristic(Characteristic.On)
            .on('get', (callback) => {
              callback(null, (self.homeKitState > 0))
            })
          break

        case 'Humidity':
          this.service = this.getService(Service.HumiditySensor)
          this.char = this.service.getCharacteristic(Characteristic.CurrentRelativeHumidity)
          this.active = this.service.getCharacteristic(Characteristic.StatusActive)
          this.enableLoggingService('weather', false)
          break

        case 'AirPressure':
          this.eveWeatherProg = new EveHomeKitWeatherTypes(this.gatoHomeBridge.hap)
          this.service = this.getService(this.eveWeatherProg.Service.SimplePressureSensor)
          this.char = this.service.getCharacteristic(this.eveWeatherProg.Characteristic.AirPressure)
          this.enableLoggingService('weather', false)
          break

        case 'LuxOmeter':
          this.service = this.getService(Service.LightSensor)
          this.char = this.service.getCharacteristic(Characteristic.CurrentAmbientLightLevel)
          break
      }

      if (this.active) {
        this.active.on('get', (callback) => {
          callback(null, true)
        })
          .updateValue(true)
      }

      this.char.on('get', (callback) => {
        self._ccu.getVariableValue(self._serial).then((newValue) => {
          let result = parseFloat(newValue).toFixed(0)
          self.log.debug('Get Request %s', result)
          callback(null, result)
        })
      })

      this.char.eventEnabled = true
    }

    this.registerAddressForEventProcessingAtAccessory(this.buildAddress(this.nameInCCU), (newValue) => {
      if (self.char) {
        self.log.debug('[Variable] update state %s', parseFloat(newValue))
        self.homeKitState = parseFloat(newValue).toFixed(0)
        self.log.debug('[Variable] parsedValue is %s', self.homeKitState)
        self.updateCharacteristic(self.char, self.homeKitState)
        if (self.isOnCharacteristic) {
          self.updateCharacteristic(self.isOnCharacteristic, (self.homeKitState > 0))
        }
        if ((self.loggingService) && (self.lastValue !== self.homeKitState)) {
          if (this.subType) {
            switch (this.subType) {
              case 'Humidity':
                self.addLogEntry({
                  temp: 0, pressure: 0, humidity: self.homeKitState
                })
                break

              case 'AirPressure':
                self.addLogEntry({
                  temp: 0, pressure: self.homeKitState, humidity: 0
                })
                break
            }
          }
        }
        self.initialQuery = false
        self.lastValue = self.homeKitState
      }
    })
  }

  shutdown() {
    super.shutdown()
    clearTimeout(this.timer)
  }

  async updateVariable() {

  }

  static channelTypes() {
    return ['VARIABLE']
  }

  static serviceDescription() {
    return 'This service provides a sensor with value from variables'
  }

  static configurationItems() {
    return {
      'Type': {
        type: 'option',
        array: ['Humidity', 'Lightbulb', 'AirPressure', 'LuxOmeter'],
        default: 'Lightbulb',
        label: 'Subtype of this device',
        hint: 'This device can have different sub types'
      }
    }
  }
  static validate(configurationItem) {
    return false
  }
}

