const { v4 } = require('uuid');
const bcrypt = require('bcrypt');

const salt = bcrypt.genSaltSync(5);
const up = `INSERT INTO users (uuid, email, mobile, password, name) VALUES ('${v4()}', 'example@example.com', '09123456789', '${bcrypt.hashSync('password', salt)}', 'Juan dela Cruz');`
const down = 'TRUNCATE TABLE `users`;';

module.exports = {
    up,
    down,
}
