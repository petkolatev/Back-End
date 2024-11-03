import Volcano from "../models/Volcano.js"

const volcanoService = {
    getAll(filter={}) {
        const query = Volcano.find()
        if (filter.name) {
            query.find({ name: { $regex: filter.name, $options: 'i' } })
        }
        if (filter.typeVolcano) {
            query.find({ typeVolcano: filter.typeVolcano })
        }
    
        return query
    },
    create(volcanoData, userId) {
        return Volcano.create({ ...volcanoData, owner: userId })
    },
    vote(volcanoId, userId) {
        return Volcano.findByIdAndUpdate(volcanoId, { $push: { voteList: userId } })
    },
    getOne(volcanoId) {
        return Volcano.findById(volcanoId)
    },
    remove(volcanoId) {
        return Volcano.findOneAndDelete(volcanoId)
    },
    edit(volcanoId, volcanoData) {
        return Volcano.findByIdAndUpdate(volcanoId, volcanoData, { runValidators: true })
    }
}

export default volcanoService