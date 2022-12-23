import { connect } from 'mongoose'
import { config } from 'dotenv'

export const connectToMongoDB = async () => {
    config()
    await connect(process.env.MONGODB_CONNECTION_URL);
}
