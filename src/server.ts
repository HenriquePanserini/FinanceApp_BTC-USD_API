import { config } from 'dotenv'
import { app } from './app'
import { connect } from 'http2'
import { connection } from 'mongoose'
import { connectToMongoDB } from './config/db'
import CandleMessageChannel from './messages/candleMessageChannel'

const createServer = async () => {
    config()

    await connectToMongoDB();
    const PORT = 3000
    const server = app.listen(PORT, () => console.log(`App running in port ${PORT}`));

    const candleMsgChannel = new CandleMessageChannel(server);
    candleMsgChannel.consumeMessages();

    process.on('SIGINT', async () => {
        await connection.close()
        server.close()
        console.log('Server and connection closed')
    });

}

createServer()
    