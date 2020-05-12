const { DataTypes } = require('sequelize');
const { uuid4 } = require('uuid');
const { getConnection } = require('../config/databases');

module.exports.createModel = (modelName, attributes) => {
    const modelAttributes = {
        ...attributes,
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        deletedAt: {
            type: DataTypes.DATE,
        },
    };

    return getConnection().define(modelName, modelAttributes, {
        paranoid: true,
    });
};

module.exports.uuid = () => {
    return uuid4();
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
