import { Model, Document, Schema} from 'mongoose'

export interface Candle extends Document{
    currency: string
    finalDateTime: Date
    open: number
    close: number
    high: number
    low: number
    color: string
}

const schema = new Schema<Candle>({

});

