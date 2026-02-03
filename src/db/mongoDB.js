import mongoose from "mongoose";



mongoose.connect(process.env.MONGO_URL)
        .catch(error => console.log('Falha na conexão!', error))

const connection = mongoose.connection

connection.once('open', () => console.log('Database rodando!!'))

export default async function obterTokenClient(req, res) {
    try {

        const id = req.body

        const token = await connection
        .useDb("plugnotas-prod")
        .collection("nfes")
        .findOne(
          { _id: new mongoose.Types.ObjectId(id) },
          { projection: {"internal.token": 1,_id: 0}}
        );

        return res.json(token.internal.token)
    } catch (error) {
        return res.status(400).json({ error: "invalid request" });
    }
}



// const returnoMongo = await obterTokenClient('602e8b97a22ff1449debc79b');
// console.log(returnoMongo)