import { config } from 'dotenv'
import { app } from './app'
import { connect } from 'http2'
import { connection } from 'mongoose'
import { connectToMongoDB } from './config/db'

const createServer = async () => {
    config()

    await connectToMongoDB();
    const PORT = process.env.PORT
    const server = app.listen(PORT, () => console.log(`App running in port ${PORT}`));

    process.on('SIGINT', async () => {
        await connection.close()
        server.close()
        console.log('Server and connection closed')
    });

}
    