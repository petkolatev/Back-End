import { Schema, model, Types } from "mongoose";

const planetShema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
    },
    age: {
        type: Number,
        required: true,
        min: 0,
    },
    solarSystem: {
        type: String,
        required: true,
        minLength: 2,
    },
    typePlanet: {
        type: String,
        required: true,
        enum: ['Inner', 'Outer', 'Dwarf'],
    },
    moons: {
        type: String,
        required: true,
        min: 0,
    },
    size: {
        type: Number,
        required: true,
        min: 0,
    },

    rings: {
        type: String,
        required: true,
        enum: ['Yes', 'No']
    },

    description: {
        type: String,
        required: true,
        minLength:10,
        maxLength:100,
    },
    image: {
        type: String,
        required: true,
        validate:/^https?:\/\//
    },
    owner: {
        type: Types.ObjectId,
        ref: 'User'
    },
    likedList: [{
        type: Types.ObjectId,
        ref: 'User'
    }]

})

const Planet = model('Planet', planetShema)

export default Planet