import Game from "../models/game.js"

const gameService = {
    getAll(filter = {}) {
        const query = Game.find()
        if (filter.name) {
            query.find({ name: { $regex: filter.name, $options: 'i' } })
        }
        if (filter.typeVolcano) {
            query.find({ typeVolcano: filter.typeVolcano })
        }

        return query
    },
    create(gameData, userId) {
        return Game.create({ ...gameData, owner: userId })
    },
    buy(gameId, userId) {
        return Game.findByIdAndUpdate(gameId, { $push: { boughtBy: userId } })
    },
    getOne(gameId) {
        return Game.findById(gameId)
    },
    remove(gameId) {
        return Game.findOneAndDelete(gameId)
    },
    edit(gameId, gameData) {
        return Game.findByIdAndUpdate(gameId, gameData, { runValidators: true })
    }
}

export default gameService