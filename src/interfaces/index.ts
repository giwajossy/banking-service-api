import { Types } from 'mongoose'

export class BaseHandler {
  public stringify(obj: any): string {
    return JSON.stringify(obj);
  }
}

export interface ITransaction {
    _id: Types.ObjectId;
    sender: Types.ObjectId;
    type: string;
    recipient: string;
    amount: number;
    createdAt: Date;
    _doc: any
}

export interface IUser {
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
  _doc: any;
  save(): any;
}


