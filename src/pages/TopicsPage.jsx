import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Modal from "react-modal";
import "../styles/TopicsPage.css";

Modal.setAppElement("#root");

const TopicsPage = () => {
  const { subjectId } = useParams();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/topics/subject/${subjectId}/topics`
        );
        setTopics(response.data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopics();
  }, [subjectId]);

  return (
    <div className="topics-list">
      <h1>Topics List</h1>
      <ul>
        {topics.map((topic) => (
          <li
            key={topic.id}
            className="topic-item"
            onClick={() => setSelectedTopic(topic)}
          >
            <div>
              <h2>{topic.name}</h2>
              <p>{topic.description}</p>
            </div>
          </li>
        ))}
      </ul>

      <Modal
        isOpen={!!selectedTopic}
        onRequestClose={() => setSelectedTopic(null)}
        shouldCloseOnOverlayClick={true}
        className="topic-modal"
        overlayClassName="modal-overlay"
        onAfterClose={() => setSelectedTopic(null)}
      >
        {selectedTopic && (
          <div className="modal-content">
            <h2>{selectedTopic.name}</h2>
            <p>{selectedTopic.description}</p>
            <div className="overlay-options">
              {" "}
              <Link
                to={`/topics/${selectedTopic.id}/questions`}
                className="questions-link"
              >
                View Questions
              </Link>
              <button
                onClick={() => setSelectedTopic(null)}
                className="close-button"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TopicsPage;
