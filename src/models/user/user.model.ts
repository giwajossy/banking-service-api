import { Schema, model, Types } from 'mongoose'
import IUser from './user.interface'

const userSchema = new Schema<IUser>({
    name: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true
    },
    hash: {
        type: String,
        required: true
    },
    wallet: {
        address: String,
        balance: {type: Number, default: 0}
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    }
})



export default model<IUser>('User', userSchema)
