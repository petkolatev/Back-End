import { Router } from "express";
import planetService from "../services/planetService.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import { isAuth } from "../middlewares/authMiddleware.js";

const planetController = Router()

planetController.get('/', async (req, res) => {
    const planets = await planetService.getAll().lean()
    res.render('planet', { title: 'Planet Catalog', planets })
})


planetController.get('/create', isAuth, (req, res) => {
    const typePlanet = getCurrentPlanetType({})
    const ringsInfo = getCurrentRingsInfo({})
    res.render('planet/create', { type: typePlanet, rings: ringsInfo, title: 'Add New Planet' })
})

planetController.post('/create', isAuth, async (req, res) => {
    const planetData = req.body
    const userId = req.user._id
    const typePlanet = getCurrentPlanetType(planetData)
    const ringsInfo = getCurrentRingsInfo(planetData)

    try {
        await planetService.create(planetData, userId)

        res.redirect('/planet',)
    } catch (err) {
        const error = getErrorMessage(err)

        res.render('planet/create', { planet: planetData, type: typePlanet, rings: ringsInfo, error, title: 'Add New Planet' })
    }
})

planetController.get('/search', async (req, res) => {
    const query = req.query
    const planets = await planetService.getAll(query).lean()
    console.log(planets);
    res.render('planet/search', { title: 'Planet Search', planets, query })
})

planetController.get('/:planetId/details', async (req, res) => {
    const planet = await planetService.getOne(req.params.planetId).lean()
    const isOwner = planet.owner == req.user?._id
    const isLiked = planet.likedList?.some(userId => userId == req.user?._id)

    res.render('planet/details', { title: 'Planet Details', planet, isOwner, isLiked })
})

planetController.get('/:planetId/like', isAuth, async (req, res) => {
    const planetId = req.params.planetId;
    const userId = req.user._id
    const isOwner = await isPlanetOwner(planetId, userId)

    if (isOwner) {
        return res.redirect(`/404`,{title:'404 - Page Not Found'})
    }

    try {
        await planetService.like(planetId, userId)
        res.redirect(`/planet/${planetId}/details`)
    } catch (error) {

    }
})

planetController.get('/:planetId/delete', isAuth, async (req, res) => {
    const isOwner = await isPlanetOwner(req.params.planetId, req.user._id)
    if (!isOwner) {
        return res.redirect(`/404`,{title:'404 - Page Not Found'})

    }
    console.log(req.params.planetId);
    try {
        await planetService.remove(req.params.planetId)
        res.redirect('/planet')

    } catch (error) {

    }

})

planetController.get('/:planetId/edit', isAuth, async (req, res) => {
    const planetData = await planetService.getOne(req.params.planetId).lean()
    const typePlanet = getCurrentPlanetType(planetData)
    const ringsInfo = getCurrentRingsInfo(planetData)
    const isOwner = planetData.owner.toString() === req.user._id

    if (!isOwner) {
        return res.redirect('/404',{title:'404 - Page Not Found'})
    }

    res.render('planet/edit', { title: 'Edit Planet', planet: planetData, type: typePlanet, rings: ringsInfo })
})

planetController.post('/:planetId/edit', isAuth, async (req, res) => {
    const planetData = req.body
    const planetId = req.params.planetId
    if (!isPlanetOwner(planetId, req.user._id)) {
        return res.redirect(`/404`,{title:'404 - Page Not Found'})

    }
    try {
        await planetService.edit(planetId, planetData)
        res.redirect(`/planet/${planetId}/details`)
    } catch (err) {
        const typePlanet = getCurrentPlanetType(planetData)
        const ringsInfo = getCurrentRingsInfo(planetData)
        const error = getErrorMessage(err)
        res.render('planet/edit', { title: 'Edit Planet', planet: planetData, type: typePlanet, rings: ringsInfo, error })
    }
})

function getCurrentPlanetType({ typePlanet }) {
    const planetTypes = ['Inner', 'Outer', 'Dwarf']

    const viewData = planetTypes.map(type => ({ value: type, label: type, selected: typePlanet === type ? 'selected' : '' }))

    return viewData
}
function getCurrentRingsInfo({ rings }) {
    const planetRingsInfo = ['Yes', 'No',]

    const viewData = planetRingsInfo.map(type => ({ value: type, label: type, selected: rings === type ? 'selected' : '' }))

    return viewData
}
async function isPlanetOwner(planetId, userId) {
    const planet = await planetService.getOne(planetId)
    const isOwner = planet.owner.toString() === userId

    return isOwner
}

export default planetController