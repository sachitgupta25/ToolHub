// pages/Home.js
import React from 'react';

const Home = () => {
  const featuredTools = [
    {
      id: 1,
      name: "Image Resizer",
      description: "Resize your images quickly and efficiently",
      icon: "🖼️"
    },
    {
      id: 2,
      name: "PDF Converter",
      description: "Convert documents to PDF format",
      icon: "📄"
    },
    {
      id: 3,
      name: "Text Analyzer",
      description: "Analyze text for sentiment and keywords",
      icon: "📊"
    }
  ];

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to ToolHub</h1>
          <p>Your one-stop destination for powerful online tools</p>
          <div className="hero-stats">
            <div className="stat">
              <h3>50+</h3>
              <p>Tools Available</p>
            </div>
            <div className="stat">
              <h3>10K+</h3>
              <p>Happy Users</p>
            </div>
            <div className="stat">
              <h3>99.9%</h3>
              <p>Uptime</p>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-tools">
        <h2>Featured Tools</h2>
        <div className="tools-grid">
          {featuredTools.map(tool => (
            <div key={tool.id} className="tool-preview">
              <div className="tool-icon">{tool.icon}</div>
              <h3>{tool.name}</h3>
              <p>{tool.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="features">
        <h2>Why Choose ToolHub?</h2>
        <div className="features-grid">
          <div className="feature">
            <h3>🚀 Fast & Efficient</h3>
            <p>All tools are optimized for speed and performance</p>
          </div>
          <div className="feature">
            <h3>🔒 Secure</h3>
            <p>Your data is processed securely and never stored</p>
          </div>
          <div className="feature">
            <h3>📱 Responsive</h3>
            <p>Works perfectly on desktop, tablet, and mobile devices</p>
          </div>
          <div className="feature">
            <h3>💡 Easy to Use</h3>
            <p>Simple and intuitive interface for all skill levels</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;