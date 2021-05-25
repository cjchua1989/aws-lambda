const up =
    'ALTER TABLE users ' +
    'ADD email_verified_at DATETIME NULL AFTER email, ' +
    'ADD mobile_verified_at DATETIME NULL AFTER mobile;';

const down = 'ALTER TABLE users ' + 'DROP COLUMN email_verified_at, ' + 'DROP COLUMN mobile_verified_at;';

module.exports = {
    up,
    down,
};
