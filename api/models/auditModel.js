var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongodb = require('mongodb');
var mongoose = require('mongoose');
Actors = require('./actorModel');
Trips = require('./tripModel');


/**
 * @swagger
 *  components:
 *    schemas:
 *      Applications:
 *        type: object
 *        required:
 *          - idExplorer
 *          - idTrip
 *          - title
 *          - description
 *        properties:
 *          idAuditor:
 *            type: mongodb.ObjectID
 *            description: Id of the auditor.
 *            example: 5e46e51d9ae2103198416348
 *          idTrip:
 *            type: mongodb.ObjectID
 *            description: Id of the trip.
 *            example: 5e46e51d9ae2103198416348
 *          createdAt:
 *            type: Date
 *            description: Date of the creation.
 *            example: 2020-02-14
 *          title:
 *            type: String
 *            description: Audit title.
 *            example: 'Title audit'
 *          description:
 *            type: String
 *            description: Audit description.
 *            example: 'Description audit for specific trip by auditor'
 *          optionalAttachments:
 *            type: array
 *            items: String
 *            description: Optional Attachments.
 *            example: ['linkImg1', 'linkTxt1']
 */
var auditSchema = new Schema({
    idAuditor: {
        type: mongodb.ObjectID,
        required: 'Kindly enter the idAuditor of the audit',
        validate: {
            validator: async function(v) {
                return Promise.resolve(Actors.findById(v, function(err, actor) {
                    return actor && actor.role == "Auditor";
                }));
            },
            message: "There are no auditor with this id"
        }
    },
    idTrip: {
        type: mongodb.ObjectID,
        required: 'Kindly enter the idTrip of the audit',
        validate: {
            validator: async function(v) {
                return Promise.resolve(Trips.findById(v, function(err, trip) {
                    return trip;
                }));
            },
            message: "There are no trip with this id"
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: 'Enter the title of the audit please'
    },
    description: {
        type: String,
        required: 'Enter the description of the audit please'
    },
    optionalAttachments: {
        type: [String]
    },
}, {strict:false});

module.exports = mongoose.model('Audits', auditSchema);