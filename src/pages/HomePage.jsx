import { Link } from "react-router-dom";
import "../styles/HomePage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import nigeriaImage from '../assets/nigeriaphoto-1127371674-1024x1024.jpg'; 
import PropTypes from 'prop-types';

const HomePage = () => {
  const [subjects, setSubjects] = useState([]); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`${import.meta.env.BASE_BACKEND_URL}/subjects`);
        
        if (Array.isArray(response.data)) {
          setSubjects(response.data);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setError("Failed to load subjects. Please try again later.");
      }
    };

    fetchSubjects();
  }, []);

  return (
    <div className="home-container">
      <nav>
        <div className="nigeria">
          <img src={nigeriaImage} alt="Nigeria" loading="lazy" />
        </div>
      </nav>
      <div className="content">
        <div className="intro">
          <h1>Welcome to Topic Finder</h1>
          <h2>Your Ultimate Prep Tool</h2>
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="subjectSection">
          {Array.isArray(subjects) && subjects.length > 0 ? (
            subjects.map((subject) => (
              <Link
                key={subject.id}
                to={`/subjects/${subject.id}/topics`}
                className="subject"
              >
                {subject.name}
              </Link>
            ))
          ) : (
            <p>No subjects available</p> 
          )}
        </div>
      </div>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Topic Finder. All rights reserved.</p>
        <p className="footerp">
          <Link to="/about" className="footer-link">About this site</Link> | 
          <span> Contact us (+23408083685286)</span>
        </p>
      </footer>
    </div>
  );
};

HomePage.propTypes = {
  subjects: PropTypes.array,
};

export default HomePage;