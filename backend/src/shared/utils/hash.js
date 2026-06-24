const bcrypt = require("bcrypt");

const SALT_ROUNDS = 12;

async function hashPassword(plainPassword) {
    return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

async function comparePassword(plainPassword, storedHash) {
    return bcrypt.compare(plainPassword, storedHash);
}

module.exports = { hashPassword, comparePassword };
