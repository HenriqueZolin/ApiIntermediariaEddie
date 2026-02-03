import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "use POST" });

  try {
    const { id } = req.body || {};
    if (!id) return res.status(400).json({ error: "missing id" });

    await mongoose.connect(process.env.MONGO_URL);

    const doc = await mongoose.connection
      .useDb("plugnotas-prod")
      .collection("nfes")
      .findOne(
        { _id: new mongoose.Types.ObjectId(id) },
        { projection: { "internal.token": 1, _id: 0 } }
      );

    return res.json({ token: doc?.internal?.token ?? null });
  } catch (error) {
    return res.status(400).json({ error: "invalid request" });
  }
}
