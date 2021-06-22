Changelog for 0.0.63:
====================

* Just one BugFix (in some cases the ui will not get devices from core)

Changelog for 0.0.62:
====================

* mostly bugfixes
* added HmIP-BSL Lights
* added variable based Light sensor


Changelog for 0.0.61:
====================

* added HmIP-DLD
* a backup file name will now contain the current date in the name
* some bugfixes

Changelog for 0.0.60:

* fixed the admin changelog bug
* added HmIP-SCTH230
* fixed var trigger helper generator
* fixed a crash that may occur when there are multiple service UUIDs in one instance
* temp sensor for HmIP-SRD is now optional
* added HomeMaticVariableBinarySwitchAccessory to use variables as other than switches (Fan / Lightbulb ...)
* added voltage level for MULTI_MODE_INPUT_TRANSMITTER

Changelog for 0.0.59:
=====================

* added HM-ES-TX-WM
* DIMMER are now available as Homekit FANs
* added HmIP-STE2-PCB
* first Test HmIP-HDM1
* Bug fixes
* introducing some fresh new bugs


Changelog for 0.0.58:
=====================

* Bug Fixes for Thermometer and Weather Station
* added HmIP-DSD-PCB
* auto refresh for cached ccu data on at the point the user loads the ui
* added HmIP-SRD


Changelog for 0.0.57:
=====================

* restore from backup will also restore the accessory infos for an existing homekit mapping
* new : reset of an instance
* added SIMPLE_SWITCH_RECEIVER to support garage door drives
* added all types of Keys as a Trigger for a Motion sensor
* support for HM-SwI-3-FM 
* support for HM-LC-DW-WM
* better HmIP-MOD-HO support
* BugFixes
* some fresh new Bugs


Changelog for 0.0.56:
=====================

* BugFixes

Changelog for 0.0.55:
=====================

* Bug fixes
* new Instances are now able to setup by using the qr code
* added some new device types


Changelog for 0.0.54:
=====================

* Bug Fixes
* customizable lock mode for Keymatic 
* CCU Temperature Chart 

Changelog for 0.0.53:
=====================

* fixed a problem that some installations are not able to create or edit devices anymore

Changelog for 0.0.51:
=====================

* worked on some timing issues

Changelog for 0.0.50:
=====================

* added multiple key device
* added http device
* fixed a bug in garage door


Changelog for 0.0.49:
=====================

* fixed a bug that some installations are not able to add new devices
* fixed a bug that special devices are not added anymore


Changelog for 0.0.48:
=====================

* bugfixes
* garage door datapoint now have selectors
* devices can be assigned to multiple hap instances

Changelog for 0.0.47:
=====================

* pimped dimmers
* garage door service has no onTime settings
* added variable based devices
* fixed some bugs


Changelog for 0.0.46:
=====================

* removed a bug in BROLL

Changelog for 0.0.45:
=====================

* eve thermo for HM-TC-IT-WM-W-EU
* fix for garage service
* some other bug fixes
* new problems new bugs 

Changelog for 0.0.44:
=====================

* flexible Alarm System
* Thermostats have not Off/Manu/Auto Modes
* Blinds with Slats
* some bugfixes
* even more new bugs


Changelog for 0.0.43:
=====================

* optional Co2 Variable for Thermometer
* some UI BugFixes
* alarm system will now send pushes
* other bug fixes
* introduced fresh new bugs

Changelog for 0.0.42:
=====================

* the welcome wizzard is back after a short visit at the beach 

Changelog for 0.0.41:
=====================

* changed WebUI to use WebSockets (beta)
* added Battery Indicators
* fixed evehistory for variables and ccu temp sensor
* fixed HmIP-MOD-HO

Changelog for 0.0.40:
=====================

* bugfix

Changelog for 0.0.39:
=====================

* some bug fixes and improvements 

Changelog for 0.0.38:
=====================

* Added a config backup
* Monitoring is now optional
* Bugfix for variables and programs with : in names
* Bugfix HmIP RadiatorThermostate
* Special device Garagedoor opener will now work with KEY devices
* Added HmIP-SWO-*
* Removed HmIP-ASIR support cause there is no need
* Fixed WinMatic


Changelog for 0.0.37:
=====================

* added optional ramp time for dimmers thanks to @comtel2000
* new hap instances will be named as HomeMatic .... (removed the _ ) thanks to @detLAN for researching this
* added a support dialog for new devices and issues


Changelog for 0.0.36:
=====================

* added HmIP-SWD

Changelog for 0.0.35:
=====================

* added HmIP-SWO-*
* added HmIP-STHO, 
* added HmIP-SRH
* added HmIP-SAM(Contact version)

Changelog for 0.0.34:
=====================

* Fix for Instances/Settings

Changelog for 0.0.33:
=====================

* some tweeks for the webUI

Changelog for 0.0.32:
=====================

* added sorting for webui lists
* implemented a nicer update button

Changelog for 0.0.31:
=====================

* only setup the monitor if system is not in debug and there was a pid file created by the launcher

Changelog for 0.0.30:
=====================

* hap-homematic will install a config for the raspberrymatic monitoring service (if there is one)
* added variable based thermometers
* new special device which will show the ccu core temperature

Changelog for 0.0.29:
=====================

* WebUI Fixed Internals in left menu
* Fixed AlarmSystem (internal vs night mode)

Changelog for 0.0.28:
=====================

* prevent the system from crash on invalid GarageDoorSensors configuration
* changed State() to Value() for fetching data from ccu
* added JALOUSIE channel to blind accessories
* removed fault characteristics from leak sensor (there is no such datapoint)

Changelog for 0.0.27:
=====================

* changed a https client call - for backwards compatibility to old node8 version on ccu3 devices

Changelog for 0.0.26:
=====================

* added special devices
* fixed CCU startup bug
* added optional ccu authentication for configuration page
* added optional https transport for configuration page

Changelog for 0.0.25:
=====================

* Added IP Blinds

Changelog for 0.0.24:
=====================

* Added WinMatic
* Changed Plugin installer to prevent backing up all the stuff (RaspberryMatic Only)

Changelog for 0.0.23:
=====================

* Bugfix for devices with service configuration like devtype:channeltype
* added a testmode

Changelog for 0.0.22:
=====================

* the webUI is now able to show the changelog
* more interal logging


Changelog for 0.0.21:
=====================

* fixed a bug, which prevents the plugin from knowing about some smoke detectors
* added a listener, to "newDevice" event on the interface, so the plugin will query the ccu for new devices, as the are teached in the ccu
