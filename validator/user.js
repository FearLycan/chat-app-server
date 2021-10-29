const {body} = require('express-validator')
const {validate} = require('./validate')

const userRegisterRules = () => {
    return [
        body('username').notEmpty().isLength({min: 4, max: 40}),
        body('email').notEmpty().isEmail().isLength({min: 4, max: 40}),
        body('password').notEmpty().isLength({min: 8, max: 40}),
    ]
}

const userLoginRules = () => {
    return [
        body('email').notEmpty().isEmail().isLength({min: 4, max: 40}),
        body('password').notEmpty().isLength({min: 8, max: 40}),
    ]
}

module.exports = {
    userRegisterRules,
    userLoginRules,
    validate,
}