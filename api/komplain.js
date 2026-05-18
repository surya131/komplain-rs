const { google } = require("googleapis");

module.exports = async (req, res) => {

  if(req.method !== "POST"){
    return res.status(405).json({
      message:"Method tidak diizinkan"
    });
  }

  try {

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
      scopes:[
        "https://www.googleapis.com/auth/spreadsheets"
      ]
    });

    const client = await auth.getClient();

    const sheets = google.sheets({
      version:"v4",
      auth:client
    });

    const {nama,noHp,unit,jenis,isi} = req.body;

    await sheets.spreadsheets.values.append({

      spreadsheetId: process.env.SPREADSHEET_ID,

      range:"Sheet1!A:G",

      valueInputOption:"USER_ENTERED",

      requestBody:{
        values:[[
          new Date().toLocaleString("id-ID"),
          nama,
          noHp,
          unit,
          jenis,
          isi,
          "Baru"
        ]]
      }

    });

    res.status(200).json({
      message:"Komplain berhasil dikirim"
    });

  } catch(err){

    console.log(err);

    res.status(500).json({
      message:"Gagal"
    });

  }

};
