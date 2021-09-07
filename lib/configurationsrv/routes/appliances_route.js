const router = require('express').Router();
const SessionCheck = require('../middleware/sessioncheck');
module.exports = function (core) {

  // @desc    Returns the list of devices
  // @route   /api/appliances

  router.get('/appliances', SessionCheck, async (req, res) => {
    // join all together
    let result = [];
    core.pluginAccessories.forEach(element => {
      result.push(Object.assign({}, element, { applianceType: 'HapDevice' }));
    });

    core.pluginPrograms.forEach(element => {
      result.push(Object.assign({}, element, { applianceType: 'HapProgram' }));
    });

    core.pluginVariables.forEach(element => {
      result.push(Object.assign({}, element, { applianceType: 'HapVariable' }));
    });

    core.pluginSpecial.forEach(element => {
      result.push(Object.assign({}, element, { applianceType: 'HapSpecial' }));
    });

    let srvList = core.getVariableServiceList();
    res.json({ appliances: result, varTrigger: core.pluginVariableTrigger, varServices: srvList });
  });

  router.patch('/device', SessionCheck, async (req, res) => {
    core.saveDevice(req.body);

    res.json({ device: req.body });
  })
  return router;
};