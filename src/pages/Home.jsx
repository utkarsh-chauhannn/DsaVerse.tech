import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (link) => {
    navigate(link);
  };

  const categories = [
    {
      title: 'Sorting Algorithms',
      description: 'Master sorting techniques with interactive 3D visualizations',
      items: ['Bubble Sort', 'Quick Sort', 'Merge Sort', 'Insertion Sort', 'Selection Sort'],
      link: '/sorting',
      color: '#3b82f6',
      icon: 'sort'
    },
    {
      title: 'Data Structures',
      description: 'Explore fundamental data structures in immersive 3D',
      items: ['Stack', 'Queue', 'Linked List', 'Binary Tree', 'Graph'],
      link: '/data-structures',
      color: '#10b981',
      icon: 'structure'
    }
  ];

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="hero-title">
          Master Data Structures & Algorithms
          <span className="hero-highlight"> Visually</span>
        </h1>
        <p className="hero-subtitle">
          Interactive 3D visualizations to help you understand and master DSA concepts.
          Learn by doing, not just reading.
        </p>
        
        <div className="hero-cta">
          <Link to="/data-structures" className="btn btn-hero">
            Get Started
          </Link>
          <Link to="#features" className="btn btn-secondary-outline">
            Learn More
          </Link>
        </div>
      </header>

      <section className="topics-section">
        <h2 className="section-title">Browse Topics</h2>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div key={index} className="category-card">
              <div className="card-header">
                <div className={`icon-badge icon-${category.icon}`}></div>
                <h3>{category.title}</h3>
              </div>
              <p className="category-description">{category.description}</p>
              <div className="category-count">{category.items.length} visualizations</div>
              
              <button
                onClick={() => handleCategoryClick(category.link)}
                className="card-link"
              >
                Explore →
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="features" id="features">
        <h2 className="section-title">Why Choose DSA Verse?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg className="feature-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3>Interactive Learning</h3>
            <p>Step through each algorithm at your own pace with full control</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg className="feature-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3>3D Visualizations</h3>
            <p>See data structures from every angle in immersive 3D</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg className="feature-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3>Real-time Insights</h3>
            <p>Understand time & space complexity as you visualize</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg className="feature-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3>Comprehensive</h3>
            <p>From basics to advanced - all algorithms in one place</p>
          </div>
        </div>
      </section>
      
      <section className="final-cta">
        <h2 className="cta-title">Ready to Start Learning?</h2>
        <p className="cta-subtitle">Start exploring data structures & algorithms</p>
        <Link to="/data-structures" className="btn btn-hero btn-large">
          Start Now
        </Link>
      </section>
    </div>
  );
};

export default Home;
