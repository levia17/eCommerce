const _ = require('lodash');

const getFields = (fields: any[], object: object) => {
    return _.pick(object, fields)
}

module.exports = { getFields }