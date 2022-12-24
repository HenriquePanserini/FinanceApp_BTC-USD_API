import {Candle, candleModel} from 'src/models/candleModel'

export default class CandleController{
    async save(candle: Candle): Promise<Candle>{
        const newCandle = await candleModel.create(candle)
        return newCandle
    }
    async findLastCandles(quantity: number): Promise<Candle[]>{
        const n = quantity > 0 ? quantity : 10;
        const lastCandles: Candle[] =
            await candleModel
                .find()
                .sort({_id: -1 })
                .limit(n);

        return lastCandles
    }
}
