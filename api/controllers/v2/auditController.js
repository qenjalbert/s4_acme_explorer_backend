'use strict';

/**
 * @swagger
 * tags:
 *   name: Audits
 *   description: Audits for trip by auditor
 */
var mongoose = require('mongoose'),
Audits = require('../../models/auditModel');
Trips = mongoose.model('Trips');
var authController = require('./authController');
var LangDictionnary = require('../../langDictionnary');
var dict = new LangDictionnary();

/**
 * @swagger
 * path:
 *  /audits:
 *    get:
 *      summary: Get all audits
 *      tags: [Audits]
 *      parameters:
 *        - name: auditorId
 *          in: query
 *          description: Id of the auditor that you wanna retrieve the audit from
 *          required: false
 *          schema:
 *            type: string
 *        - name: tripId
 *          in: query
 *          description: Id of the trip that you wanna retrieve the audit from
 *          required: false
 *          schema:
 *            type: string
 *        - $ref: '#/components/parameters/language'
 *      responses:
 *        "200":
 *          description: Return all audits
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                $ref: '#/components/schemas/Audits'
 *        "500":
 *          description: Internal error
 */
exports.list_all_audits = function(req, res) {
    var filters = {};
    if(req.query.auditorId) filters.idAuditor = req.query.auditorId;
    if(req.query.tripId) filters.idTrip = req.query.tripId; 
    var lang = dict.getLang(req);
    Audits.find(filters, function(err, audits) {
        if(err) {
            res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
        } else {
            res.json(audits);
        }
    });
}

/**
 * @swagger
 * path:
 *  /audits:
 *    post:
 *      summary: Create an Audit
 *      tags: [Audits]
 *      parameters:
 *        - $ref: '#/components/parameters/language'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Audits'
 *      responses:
 *        "201":
 *          description: Audit created
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Audits'
 *        "422":
 *          description: Validation Error
 *        "500":
 *          description: Server error
 */
exports.create_an_audit = function(req, res) {
    var lang = dict.getLang(req);
    var token = req.headers['authorization'];

    Trips.findById({_id: req.body.idTrip}, function(err, trip) {
        if (err) {
            res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
        } 
        else if (!trip) {
            res.status(404).send({ err: dict.get('RessourceNotFound', lang, 'trip', req.body.idTrip) });
        }
        else {
            authController.getUserId(token)
                .then((auditorId) => {
                    var new_audit = new Audits(req.body);
                    new_audit.idAuditor = auditorId;
                    new_audit.save(function(err, audit) {
                        if (err) {
                            if(err.name=='ValidationError') {
                                res.status(422).send({ err: dict.get('ErrorSchema', lang) });
                            }
                            else{
                                res.status(500).send({ err: dict.get('ErrorCreateDB', lang) });
                            }
                        }
                        else {
                            res.status(201).json(audit);
                        }
                    });
                })
                .catch((err) => {
                    res.status(500).send(err);
                })
        }
    });
}

/**
 * @swagger
 * path:
 *  /audits/{auditId}:
 *    get:
 *      summary: Get an audit
 *      tags: [Audits]
 *      parameters:
 *         - name: auditId
 *           in: path
 *           description: audit Id
 *           required: true
 *           schema:
 *             type: string
 *         - $ref: '#/components/parameters/language'
 *      responses:
 *        "200":
 *          description: Return an audit
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Audits'
 *        "404":
 *          description: Ressource not found
 *        "500":
 *          description: Internal error
 */
exports.read_an_audit = function(req, res) {
    var lang = dict.getLang(req);
    Audits.findById(req.params.auditId, function(err, audit) {
        if(err) {
            res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
        } else if (!audit) {
            res.status(404).send({ err: dict.get('RessourceNotFound', lang, 'audit', req.params.auditId) });
        } else {
            res.status(200).json(audit);
        }
    })
}
