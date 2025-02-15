const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();
const port = 3000;

app.use(cors());

// Define output directory
const outputDir = path.join(__dirname, "files");

// Ensure "files" directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Configure storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads"); // Temporary upload storage
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

app.post("/convertFile", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const inputPath = req.file.path;
    const outputFileName = req.file.originalname.replace(/\.[^/.]+$/, "") + ".pdf";
    const outputFilePath = path.join(outputDir, outputFileName);

    // Use LibreOffice to convert DOCX to PDF
    const libreOfficeCommand = `"C:\\Program Files\\LibreOffice\\program\\soffice.exe" --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`;

    exec(libreOfficeCommand, (error, stdout, stderr) => {
        if (error) {
            console.error("❌ Conversion Error:", error);
            return res.status(500).json({ message: "Error converting file" });
        }

        if (stderr) {
            console.warn("⚠️ LibreOffice Warning:", stderr);
        }

        // Send the file as a direct download
        res.json({ downloadUrl: `http://localhost:${port}/download/${outputFileName}` });
    });
});

// Serve files with forced download
app.get("/download/:filename", (req, res) => {
    const filePath = path.join(outputDir, req.params.filename);
    res.download(filePath, req.params.filename, (err) => {
        if (err) {
            console.error("Download Error:", err);
            res.status(500).send("Error downloading file.");
        }
    });
});

app.listen(port, () => {
    console.log(`✅ Server is running at http://localhost:${port}`);
});
