import React, { useState } from "react";
import { FaFileWord, FaDownload } from "react-icons/fa6";
import axios from "axios";

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convert, setConvert] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setConvert("");
    setDownloadError("");
    setDownloadUrl(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setConvert("Please select a file");
      return;
    }

    setLoading(true);
    setConvert("");
    setDownloadUrl(null);
    setDownloadError("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:3000/convertFile",
        formData
      );

      setDownloadUrl(response.data.downloadUrl);
      setConvert("✅ File Converted Successfully!");
    } catch (error) {
      console.error(error);
      setDownloadError("❌ Error occurred while converting the file.");
    } finally {
      setLoading(false);
    }
  };

  // New: Auto trigger download when file is ready
  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", downloadUrl.split("/").pop()); // Extract file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-10 rounded-lg shadow-lg w-full max-w-lg text-center transform hover:scale-105 transition duration-300">
        <h1 className="text-3xl font-extrabold mb-4 text-blue-400">
          Convert Word to PDF
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Upload your Word document and get a PDF in seconds.
        </p>

        <div className="flex flex-col items-center space-y-6">
          <input
            type="file"
            accept=".doc,.docx"
            onChange={handleFileChange}
            className="hidden"
            id="FileInput"
          />
          <label
            htmlFor="FileInput"
            className="w-full flex items-center justify-center px-6 py-4 bg-gray-700 text-gray-300 rounded-lg shadow-lg cursor-pointer border border-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
          >
            <FaFileWord className="text-3xl mr-3 text-blue-400" />
            <span className="text-lg">{selectedFile ? selectedFile.name : "Choose File"}</span>
          </label>

          <button
            onClick={handleSubmit}
            disabled={!selectedFile || loading}
            className={`text-white font-bold px-8 py-3 rounded-lg shadow-md transition-all duration-300 ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-800"
            }`}
          >
            {loading ? "Converting..." : "Convert File"}
          </button>

          {loading && (
            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
              <div className="bg-blue-500 h-2.5 rounded-full animate-pulse"></div>
            </div>
          )}

          {convert && <div className="text-green-400 text-center">{convert}</div>}
          {downloadError && <div className="text-red-500 text-center">{downloadError}</div>}

          {downloadUrl && (
            <button
              onClick={handleDownload}
              className="flex items-center bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition-all duration-300"
            >
              <FaDownload className="mr-2" /> Download PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
