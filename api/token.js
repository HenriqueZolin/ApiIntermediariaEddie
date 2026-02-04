import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "use POST" });

  try {
    // 1) body
    const { id } = req.body || {};
    if (!id) return res.status(400).json({ error: "missing id" });

    // 2) valida ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "invalid ObjectId" });
    }

    // 3) valida env var
    if (!process.env.MONGO_URL) {
      return res.status(500).json({ error: "MONGO_URL not set" });
    }

    // 4) conecta
    await mongoose.connect(process.env.MONGO_URL);

    // 5) consulta
    const doc = await mongoose.connection
      .useDb("plugnotas-prod")
      .collection("nfes")
      .findOne(
        { _id: new mongoose.Types.ObjectId(id) },
        { projection: { "internal.token": 1, _id: 0 } }
      );

    return res.status(200).json({ token: doc?.internal?.token ?? null });
  } catch (err) {
    console.error("Mongo function error:", err); // <- aparece nos logs da Vercel
    return res.status(500).json({ error: err?.message || "unknown error" });
  }
}
