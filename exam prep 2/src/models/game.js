import { Schema, model, Types } from "mongoose";

const gameShema = new Schema({
    platform: {
        type: String,
        required: true,
        enum: ["PC", "Nintendo", "PS4", "PS5", "XBOX"],
    },
    name: {
        type: String,
        required: true,
        minLength: 4,
    },
    image: {
        type: String,
        required: true,
        validate: /^https?:\/\//
    },
    price: {
        type: Number,
        required: true,
        min: 1,
    },
    genre: {
        type: String,
        required: true,
        minLength:2,
    },
    description: {
        type: String,
        required: true,
        minLength: 10,
    },
    
    owner: {
        type: Types.ObjectId,
        ref: 'User'
    },
    boughtBy: [{
        type: Types.ObjectId,
        ref: 'User'
    }]

})

const Game = model('Game', gameShema)

export default Game