import { google } from "googleapis";

export default async function handler(req, res) {

  if (req.method !== "GET") {
    return res.status(405).json({ success: false });
  }

  // Simple password protection
  if (req.headers.authorization !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });

    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1"
    });

    res.status(200).json({
      success: true,
      data: response.data.values || []
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
