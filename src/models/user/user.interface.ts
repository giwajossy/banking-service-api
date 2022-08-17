import { Types } from 'mongoose';

interface IUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    hash: string; 
    wallet: {
        address: string,
        balance: number
    };
    isDeleted: boolean;
    createdAt: Date;
    _doc: any
}

export default IUser

