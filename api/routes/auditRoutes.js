'use strict';

const express = require('express');
var routerV2 = express.Router();
var authController = require('../controllers/v2/authController');

module.exports = function(app) {
    var audit = require('../controllers/v2/auditController');

    routerV2.route('/audits')
        .get(audit.list_all_audits)
        .post(authController.verifyUser(["Auditor"]), audit.create_an_audit);
    routerV2.route('/audits/:auditId')
        .get(audit.read_an_audit);
    
    app.use("/v2/", routerV2);
}