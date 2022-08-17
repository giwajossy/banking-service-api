import { Types } from 'mongoose'

interface ITransaction {
    _id: Types.ObjectId;
    sender: Types.ObjectId;
    type: string;
    recipient: string;
    amount: number;
    createdAt: Date;
    _doc: any
}


export default ITransaction
