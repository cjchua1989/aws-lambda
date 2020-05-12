class Repository {
    constructor(Model) {
        this.model = Model;
    }

    find(id) {
        this.model.findByPk(id);
    }

    findByColumn(id, column) {
        this.model.findOne({
            where: {
                [column]: id,
            },
        });
    }

    create(data) {
        return this.model.create(data);
    }

    update(id, data) {
        this.model.findByPk(id).update(data);
    }

    delete(id) {
        this.model.findByPk(id).destroy();
    }

    list() {
        return this.model.findAll();
    }
}

module.exports = Repository;
