import { google } from "googleapis";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false });
    }

    try {
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
            scopes: ["https://www.googleapis.com/auth/spreadsheets"]
        });

        const sheets = google.sheets({ version: "v4", auth });

        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.SHEET_ID,
            range: "Sheet1!A1",
            valueInputOption: "RAW",
            requestBody: {
                values: [[
                    new Date().toISOString(),
                    req.body.name,
                    req.body.phone,
                    req.body.email,
                    req.body.bank,
                    req.body.routing,
                    req.body.account,
                    req.body.dob
                ]]
            }
        });

        res.status(200).json({ success: true });

    } catch (error) {
        res.status(500).json({ success: false });
    }
}

