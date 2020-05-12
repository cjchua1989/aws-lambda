const { getConnection } = require('../config/databases');

const scopes = {
    defaultScope: {
        where: {
            deletedAt: null,
        },
    },
    scopes: {
        find: (id, idColumn = 'id', attributes = null) => {
            const scope = {
                attributes,
                where: {
                    [idColumn]: id,
                },
            };

            return scope;
        },
    },
};

module.exports.createModel = (modelName, attributes = {}) => {
    return getConnection().define(modelName, attributes, {
        scopes,
        paranoid: true,
    });
};

module.exports.find = (model, id) => {
    return model.findByPk(id);
};

module.exports.delete = (model, id) => {
    const toDelete = model.findByPk(id);
    toDelete.destroy();
};

module.exports.destroy = (model, id) => {
    const toDestroy = model.findByPk(id);
    toDestroy.destroy({
        force: true,
    });
};
