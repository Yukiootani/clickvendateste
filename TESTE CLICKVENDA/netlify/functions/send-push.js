const admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();
const messaging = admin.messaging();
exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  try {
    const data = JSON.parse(event.body);
    const tokensSnapshot = await db.collection("push_tokens").get();
    if (tokensSnapshot.empty) return { statusCode: 200, body: JSON.stringify({ message: "Sem inscritos." }) };
    const tokens = [];
    tokensSnapshot.forEach((doc) => { if (doc.data().token) tokens.push(doc.data().token); });
    const message = {
      notification: { title: data.title || "Novidade!", body: data.body || "Confira nossas ofertas." },
      tokens: tokens,
    };
    await messaging.sendEachForMulticast(message);
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};