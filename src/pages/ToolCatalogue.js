// pages/ToolCatalogue.js
import React, { useState, useEffect } from 'react';

const ToolCatalogue = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState({});

  // API call to fetch tools - replace URL with your actual API endpoint
  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        
        // Replace this mock API call with your actual API endpoint
        // const response = await fetch('https://your-api.com/api/tools');
        // const data = await response.json();
        // setTools(data);
        
        // Mock API response for demonstration
        setTimeout(() => {
          const mockTools = [
            {
              id: 1,
              toolname: "Image Resizer",
              description: "Resize images to custom dimensions while maintaining quality. Supports JPG, PNG, and WebP formats.",
              image: "https://via.placeholder.com/300x200?text=Image+Resizer",
              status: "active"
            },
            {
              id: 2,
              toolname: "PDF Converter",
              description: "Convert various document formats (Word, Excel, PowerPoint) to PDF format quickly and securely.",
              image: "https://via.placeholder.com/300x200?text=PDF+Converter",
              status: "active"
            },
            {
              id: 3,
              toolname: "Text Analyzer",
              description: "Analyze text for sentiment, keywords, readability score, and word count statistics.",
              image: "https://via.placeholder.com/300x200?text=Text+Analyzer",
              status: "maintenance"
            },
            {
              id: 4,
              toolname: "Video Compressor",
              description: "Compress video files to reduce size without losing quality. Supports MP4, AVI, MOV formats.",
              image: "https://via.placeholder.com/300x200?text=Video+Compressor",
              status: "active"
            },
            {
              id: 5,
              toolname: "QR Code Generator",
              description: "Generate QR codes for URLs, text, contact information, WiFi credentials, and more.",
              image: "https://via.placeholder.com/300x200?text=QR+Generator",
              status: "active"
            },
            {
              id: 6,
              toolname: "Color Palette Extractor",
              description: "Extract dominant colors from uploaded images and generate beautiful color palettes.",
              image: "https://via.placeholder.com/300x200?text=Color+Extractor",
              status: "inactive"
            },
            {
              id: 7,
              toolname: "Audio Trimmer",
              description: "Trim and cut audio files with precision. Supports MP3, WAV, and AAC formats.",
              image: "https://via.placeholder.com/300x200?text=Audio+Trimmer",
              status: "active"
            },
            {
              id: 8,
              toolname: "Excel to JSON",
              description: "Convert Excel spreadsheets to JSON format for easy data processing and API integration.",
              image: "https://via.placeholder.com/300x200?text=Excel+to+JSON",
              status: "active"
            }
          ];
          setTools(mockTools);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error fetching tools:', error);
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  const handleFileUpload = (event, toolId) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setSelectedFiles(prev => ({
        ...prev,
        [toolId]: uploadedFile
      }));
    }
  };

  const handleRunTool = async (toolId) => {
    const selectedFile = selectedFiles[toolId];
    const tool = tools.find(t => t.id === toolId);
    
    if (!selectedFile) {
      alert('Please upload a file first');
      return;
    }

    if (tool.status !== 'active') {
      alert('This tool is currently unavailable');
      return;
    }

    // Here you would make an API call to process the file
    try {
      alert(`Processing ${selectedFile.name} with ${tool.toolname}...`);
      
      // Example API call structure:
      // const formData = new FormData();
      // formData.append('file', selectedFile);
      // formData.append('toolId', toolId);
      // 
      // const response = await fetch(`https://your-api.com/api/process/${toolId}`, {
      //   method: 'POST',
      //   body: formData
      // });
      // 
      // const result = await response.json();
      // Handle the result...
      
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'maintenance': return '#FF9800';
      case 'inactive': return '#f44336';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'maintenance': return 'Maintenance';
      case 'inactive': return 'Inactive';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading tools...</p>
      </div>
    );
  }

  return (
    <div className="tool-catalogue">
      <div className="catalogue-header">
        <h1>Tool Catalogue</h1>
        <p>Discover and use our collection of {tools.length} powerful tools</p>
      </div>

      <div className="tools-container">
        {tools.map(tool => (
          <div key={tool.id} className="tool-card">
            <div className="tool-image">
              <img src={tool.image} alt={tool.toolname} />
              <div 
                className="status-badge" 
                style={{ backgroundColor: getStatusColor(tool.status) }}
              >
                {getStatusText(tool.status)}
              </div>
            </div>
            
            <div className="tool-content">
              <h3>{tool.toolname}</h3>
              <p>{tool.description}</p>
              
              <div className="tool-actions">
                <div className="file-upload">
                  <input
                    type="file"
                    id={`file-${tool.id}`}
                    onChange={(e) => handleFileUpload(e, tool.id)}
                    disabled={tool.status !== 'active'}
                    accept="*/*"
                  />
                  <label 
                    htmlFor={`file-${tool.id}`} 
                    className={`upload-btn ${tool.status !== 'active' ? 'disabled' : ''}`}
                  >
                    📁 Upload File
                  </label>
                </div>
                
                <button
                  className={`run-btn ${tool.status !== 'active' ? 'disabled' : ''}`}
                  onClick={() => handleRunTool(tool.id)}
                  disabled={tool.status !== 'active'}
                >
                  ▶️ Run Tool
                </button>
              </div>

              {selectedFiles[tool.id] && (
                <div className="selected-file">
                  <small>📎 Selected: {selectedFiles[tool.id].name}</small>
                  <span className="file-size">
                    ({(selectedFiles[tool.id].size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolCatalogue;