'use strict';

/**
 * @swagger
 * tags:
 *   name: Finders
 *   description: Finders organize
 */
var mongoose = require('mongoose'),
Finders = mongoose.model('Finders');
var LangDictionnary = require('../langDictionnary');
var dict = new LangDictionnary();

/**
 * @swagger
 * path:
 *  /finders:
 *    get:
 *      summary: Get all finders
 *      tags: [Finders]
 *      responses:
 *        "200":
 *          description: Return all finders
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                $ref: '#/components/schemas/Finders'
 *        "500":
 *          description: Internal error
 */
exports.list_all_finders = function(req, res) {
    var lang = dict.getLang(req);
    Finders.find({}, function(err, finders) {
        if (err) {
            res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
        }
        else {
            res.status(200).json(finders);
        }
    });
}

/**
 * @swagger
 * path:
 *  /finders:
 *    post:
 *      summary: Create an finder
 *      tags: [Finders]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Finders'
 *      responses:
 *        "201":
 *          description: Finder created
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Finders'
 *        "422":
 *          description: Validation Error
 *        "500":
 *          description: Server error
 */
exports.create_a_finder = function(req, res) {
    var lang = dict.getLang(req);
    var new_finder = new Finders(req.body);
    new_finder.save(function(err, finder) {
        if (err) {
            if (err.name=='ValidationError') {
                res.status(422).send({ err: dict.get('ErrorSchema', lang) });
            }
            else{
                res.status(500).send({ err: dict.get('ErrorCreateDB', lang) });
            }
        }
        else {
            res.status(201).json(finder);
        }
    });
}

/**
 * @swagger
 * path:
 *  /finders/{finderId}:
 *    get:
 *      summary: Get a finder
 *      tags: [Finders]
 *      parameters:
 *         - name: finderId
 *           in: path
 *           description: finder Id
 *           required: true
 *           schema:
 *             type: string
 *      responses:
 *        "200":
 *          description: Return a finder
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Finders'
 *        "404":
 *          description: Ressource not found
 *        "500":
 *          description: Internal error
 */
exports.read_a_finder = function(req, res) {
    var lang = dict.getLang(req);
    Finders.findById(req.params.finderId, function(err, finder) {
        if (err) {
            res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
        } 
        else if (!finder) {
            res.status(404).send({ err: dict.get('RessourceNotFound', lang, 'finder', req.params.finderId) });
        }
        else {
            res.json(finder);
        }
    })
}

/**
 * @swagger
 * path:
 *  /finders/{finderId}:
 *    put:
 *      summary: Edit a finder
 *      tags: [Finders]
 *      parameters:
 *         - name: finderId
 *           in: path
 *           description: finder Id
 *           required: true
 *           schema:
 *             type: string
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Finders'
 *      responses:
 *        "200":
 *          description: Finder updated
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                $ref: '#/components/schemas/Finders'
 *        "404":
 *          description: Ressource not found
 *        "422":
 *          description: Validation Error
 *        "500":
 *          description: Internal error
 */
exports.edit_a_finder = function(req, res) {
    var lang = dict.getLang(req);
    Finders.findOneAndUpdate({_id: req.params.finderId}, req.body, {new:true, runValidators: true}, function(err, finder) {
        if (err) {
            if (err.name=='ValidationError') {
                res.status(422).send({ err: dict.get('ErrorSchema', lang) });
            }
            else {
              res.status(500).send({ err: dict.get('ErrorUpdateDB', lang) });
            }
        } 
        else if (!finder) {
            res.status(404).send({ err: dict.get('RessourceNotFound', lang, 'finder', req.params.finderId) });
        } 
        else {
            res.status(200).json(finder);
        }
    })
}

/**
 * @swagger
 * path:
 *  /finders/{finderId}:
 *    delete:
 *      summary: Delete a finder
 *      tags: [Finders]
 *      parameters:
 *         - name: finderId
 *           in: path
 *           description: finder Id
 *           required: true
 *           schema:
 *             type: string
 *      responses:
 *        "200":
 *          description: Item delete msg
 *        "500":
 *          description: Internal error
 */
exports.delete_a_finder = function(req, res) {
    var lang = dict.getLang(req);
    var id = req.params.finderId
    Finders.findOneAndDelete({"_id": id}, null, function(err, finder) {
        if(err) {
            res.status(500).send({ err: dict.get('ErrorDeleteDB', lang) });
        } 
        else {
            res.sendStatus(204);
        }
    })
}