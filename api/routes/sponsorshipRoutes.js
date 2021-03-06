'use strict';
const express = require('express');
var routerv1 = express.Router();
var routerv2 = express.Router();

module.exports = function(app) {
    var sponsorshipsv1 = require('../controllers/v1/sponsorshipController');
    var sponsorshipsv2 = require('../controllers/v2/sponsorshipController');
    var auth = require('../controllers/v2/authController');

    routerv1.route('/sponsorships')
        .get(sponsorshipsv1.list_all_sponsorships)
        .post(sponsorshipsv1.create_a_sponsorship)
    routerv1.route('/sponsorships/:sponsorshipId')
        .get(sponsorshipsv1.read_a_sponsorship)
        .put(sponsorshipsv1.edit_a_sponsorship)
        .delete(sponsorshipsv1.delete_a_sponsorship)
    routerv1.route('/sponsorships/:sponsorshipId/pay')
        .patch(sponsorshipsv1.handle_sponsorship_payement)
    routerv1.route('/sponsorships/flatRate')
        .patch(sponsorshipsv1.handle_flat_rate_change)

    app.use("/v1", routerv1)
    
    routerv2.route('/sponsorships')
        .get(sponsorshipsv2.list_all_sponsorships)
        .post(sponsorshipsv2.create_a_sponsorship)
    routerv2.route('/sponsorships/:sponsorshipId')
        .get(sponsorshipsv2.read_a_sponsorship)
        .put(sponsorshipsv2.edit_a_sponsorship)
        .delete(sponsorshipsv2.delete_a_sponsorship)
    routerv2.route('/sponsorships/:sponsorshipId/pay')
        .patch(sponsorshipsv2.handle_sponsorship_payement)
    routerv2.route('/sponsorships/flatRate')
        .patch(auth.verifyUser(['Administrator']), sponsorshipsv2.handle_flat_rate_change)

    app.use("/v2", routerv2)   
}