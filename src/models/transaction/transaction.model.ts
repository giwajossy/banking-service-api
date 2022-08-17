import { Schema, model} from 'mongoose'
import ITransaction from './transaction.interface'

const transactionSchema = new Schema<ITransaction>({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['deposit', 'withdrawal', 'transfer']
    },
    recipient: {
        type: String
    },
    amount: {
        type: Number
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    }
})





export default model<ITransaction>('Transaction', transactionSchema)

      