import { Channel, connect } from 'amqplib'
import { config } from 'dotenv'
import { Server } from 'socket.io'
import * as http from 'http'
import CandleController from 'src/controllers/candlesController'
import {Candle} from '../models/candleModel'


config()

export default class CandleMessageChannel {

    private _channel!: Channel 
    private _candleCtrl: CandleController
    private _io: Server

    constructor(server: http.Server){
        this._candleCtrl = new CandleController()
        this._io = new Server(server, {
            cors: {
                origin: 'http://localhost:8080',
                methods: ["GET", "POST"]
            }
        })
        this._io.on('connection', () => console.log('Web socket connection created'))
    }

    async createMessageChannel()
    {
        try {
            const connection = await connect(process.env.AMQP_SERVER || 'amqp://henrique:gtcanime@localhost:5672')
            this._channel = await connection.createChannel()
            this._channel.assertQueue(process.env.QUEUE_NAME || 'candles') 
        } catch (err) {
            console.log('Connection to RabbitMQ failed')
            console.log(err)
        }

    }

    consumeMessages(){
        
        this._channel.consume('candles', async msg => {
            const candleObj = JSON.parse(msg.content.toString())
            console.log('Message received')
            console.log(candleObj)
            this._channel.ack(msg)

            const candle: Candle = candleObj
            await this._candleCtrl.save(candle)
            console.log('Candle saved in database')
            this._io.emit(process.env.SOCKET_EVENT_NAME || 'newCandles', candle)
    })
}
}
