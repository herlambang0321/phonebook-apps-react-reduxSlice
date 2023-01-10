var express = require('express');
var router = express.Router();
var models = require('../models');
var { Response } = require('../helpers/util')
const { Op } = require('sequelize')


router.get('/phonebooks', async function (req, res, next) {
    try {
        const { name, phone } = req.query

        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const offset = (page - 1) * limit;

        if (name && phone) {
            const { count, rows } = await models.User.findAndCountAll({
                where: {
                    [Op.or]: [
                        {
                            name: {
                                [Op.iLike]: `%${name}%`
                            }
                        },
                        {
                            phone: {
                                [Op.iLike]: `%${phone}%`
                            }
                        }
                    ]
                },
                order: [
                    ['id', 'ASC']
                ],
                limit: limit,
                offset: offset
            })

            const totalPage = Math.ceil(count / limit);
            res.json(new Response({
                rows,
                page,
                totalPage
            }))

        } else if (name) {
            const { count, rows } = await models.User.findAndCountAll({
                where: {
                    [Op.and]: [
                        {
                            name: {
                                [Op.iLike]: `%${name}%`
                            }
                        }
                    ]
                },
                order: [
                    ['id', 'ASC']
                ],
                limit: limit,
                offset: offset
            })

            const totalPage = Math.ceil(count / limit);
            res.json(new Response({
                rows,
                page,
                totalPage
            }))
        } else if (phone) {
            const { count, rows } = await models.User.findAndCountAll({
                where: {
                    [Op.and]: [
                        {
                            phone: {
                                [Op.iLike]: `%${phone}%`
                            }
                        }
                    ]
                },
                order: [
                    ['id', 'ASC']
                ],
                limit: limit,
                offset: offset
            })

            const totalPage = Math.ceil(count / limit);
            res.json(new Response({
                rows,
                page,
                totalPage
            }))
        } else {
            const { count, rows } = await models.User.findAndCountAll({
                order: [
                    ['id', 'ASC']
                ],
                limit: limit,
                offset: offset
            })

            const totalPage = Math.ceil(count / limit);
            res.json(new Response({
                rows,
                page,
                totalPage
            }))
        }
    } catch (err) {
        res.status(500).json(new Response(err, false))
    }
});

router.post('/phonebooks', async function (req, res, next) {
    try {
        const user = await models.User.create(req.body)
        res.json(new Response(user))
    } catch (err) {
        res.status(500).json(new Response(err, false))
    }
});

router.put('/phonebooks/:id', async function (req, res, next) {
    try {
        const user = await models.User.update(req.body, {
            where: {
                id: req.params.id
            },
            returning: true,
            plain: true
        })
        res.json(new Response(user[1]))
    } catch (err) {
        res.status(500).json(new Response(err, false))
    }
});

router.delete('/phonebooks/:id', async function (req, res, next) {
    try {
        const user = await models.User.destroy({
            where: {
                id: req.params.id
            }
        })
        res.json(new Response(user))
    } catch (err) {
        res.status(500).json(new Response(err, false))
    }
});

module.exports = router;
