const _ = require('lodash');

export const getFields = (fields: any[], object: object) => {
    return _.pick(object, fields)
}
