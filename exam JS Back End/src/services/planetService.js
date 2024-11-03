import Planet from "../models/Planet.js"

const planetService = {
    getAll(filter = {}) {
        const query = Planet.find()
        if (filter.name) {
            query.find({ name: { $regex: filter.name, $options: 'i' } })
        }
        if (filter.solarSystem) {
            query.find({ solarSystem: { $regex: filter.solarSystem, $options: 'i' } })
        }

        return query
    },
    create(planetData, userId) {
        return Planet.create({ ...planetData, owner: userId })
    },
    like(planetId, userId) {
        return Planet.findByIdAndUpdate(planetId, { $push: { likedList: userId } })
    },
    getOne(planetId) {
        return Planet.findById(planetId)
    },
    remove(planetId) {

        return Planet.findOneAndDelete(
            { "_id": planetId }
        )
    },
    edit(planetId, planetData) {
        return Planet.findByIdAndUpdate(planetId, planetData, { runValidators: true })
    }
}

export default planetService
