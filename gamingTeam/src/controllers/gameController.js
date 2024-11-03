import { Router } from "express";
import gameService from "../services/gamesService.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import { isAuth } from "../middlewares/authMiddleware.js";

const gamesController = Router()

gamesController.get('/', async (req, res) => {
    const games = await gameService.getAll().lean()
    res.render('catalog/index', { title: 'Catalog', games })
});

gamesController.get('/create', isAuth, (req, res) => {
    const gameTypeData = getCurrentGamePlatform({})

    res.render('catalog/create', { gameType: gameTypeData, title: 'Create' })
});
gamesController.post('/create', isAuth, async (req, res) => {
    const gameData = req.body
    const userId = req.user._id

    try {
        await gameService.create(gameData, userId)

        res.redirect('/catalog')
    } catch (err) {
        const error = getErrorMessage(err)
        const gameTypeData = getCurrentGamePlatform(gameData)

        res.render('catalog/create', { game: gameData, gameType: gameTypeData, error, title: 'Create' })
    }
})

gamesController.get('/:gameId/details', async (req, res) => {
    const game = await gameService.getOne(req.params.gameId).lean()
    const isOwner = game.owner == req.user?._id
    const isBought = game.boughtBy?.some(userId => userId == req.user?._id)

    res.render('catalog/details', { title: 'Details', game, isOwner, isBought })
})

gamesController.get('/:gameId/buy', isAuth, async (req, res) => {
    const gameId = req.params.gameId
    const userId = req.user._id
    const isOwner = await isGameOwner(gameId, userId)
  
    if (isOwner) {
        return res.redirect(`/404`)
    }

    try {
        await gameService.buy(gameId, userId)
        res.redirect(`/catalog/${gameId}/details`)
    } catch (error) {

    }
})

gamesController.get('/:gameId/delete', isAuth, async (req, res) => {
    if (!isGameOwner(req.params.gameId, req.user._id)) {
        return res.redirect(`/404`)

    }
    try {
        await gameService.remove(req.params.gameId)
        res.redirect('/catalog')

    } catch (error) {

    }

})
gamesController.get('/:gameId/edit', isAuth, async (req, res) => {
    const game = await gameService.getOne(req.params.gameId).lean()
    const gamePlatforms = getCurrentGamePlatform(game)
    const isOwner = game.owner.toString() === req.user._id

    if (!isOwner) {
        return res.redirect('/404')
    }

    res.render('catalog/edit', { title: 'Edit Page', game, gamePlatforms })
})

gamesController.post('/:gameId/edit', isAuth, async (req, res) => {
    const gameData = req.body
    const gameId = req.params.gameId
    if (!isGameOwner(gameId, req.user._id)) {
        return res.redirect(`/404`)

    }
    try {
        await gameService.edit(gameId, gameData)
        res.redirect(`/catalog/${gameId}/details`)
    } catch (err) {
        const gamePlatforms = getCurrentGamePlatform(gameData)
        const error = getErrorMessage(err)
        res.render('catalog/edit', { title: 'Edit Page', game: gameData, gamePlatforms, error })
    }
})


function getCurrentGamePlatform({ platform }) {
    const gamePlatforms = ["PC", "Nintendo", "PS4", "PS5", "XBOX",]

    const viewData = gamePlatforms.map(type => ({ value: type, label: type, selected: platform === type ? 'selected' : '' }))


    return viewData
}
async function isGameOwner(gameId, userId) {
    const game = await gameService.getOne(gameId)
    const isOwner = game.owner.toString() === userId

    return isOwner
}


export default gamesController
