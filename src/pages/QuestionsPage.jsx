import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import "../styles/QuestionsPage.css";
import PropTypes from 'prop-types';

const QuestionsPage = () => {
  const { topicId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.BASE_BACKEND_URL}/questions/topic/${topicId}/questions`
        );
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Failed to load questions. Please try again later.");
      }
    };

    fetchQuestions();
  }, [topicId]);

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    let y = 10; // Start position for the first line of text

    questions.forEach((question, index) => {
      doc.setFontSize(12);
      doc.text(`Q${index + 1}: ${question.questionText}`, 10, y);
      y += 10;

      Object.entries(question.options).forEach(([key, value]) => {
        doc.text(`Option ${key}: ${value}`, 20, y);
        y += 10;
      });

      doc.text(`Answer: ${question.answer}`, 10, y);
      y += 10;
      doc.text(`Year: ${question.year}`, 10, y);
      y += 15; // Add extra spacing after each question

      if (y > 270) { // Add a new page if content exceeds page height
        doc.addPage();
        y = 10; // Reset y for the new page
      }
    });

    doc.save("questions.pdf");
  };

  const exportToDOC = () => {
    const doc = new Document();

    questions.forEach((question, index) => {
      const questionHeader = new Paragraph({
        children: [new TextRun(`Q${index + 1}: ${question.questionText}`).bold()],
      });

      const options = Object.entries(question.options).map(
        ([key, value]) =>
          new Paragraph({
            children: [new TextRun(`Option ${key}: ${value}`)],
          })
      );

      const answer = new Paragraph({
        children: [new TextRun(`Answer: ${question.answer}`).italic()],
      });

      const year = new Paragraph({
        children: [new TextRun(`Year: ${question.year}`)],
      });

      doc.addSection({
        children: [questionHeader, ...options, answer, year, new Paragraph("\n")],
      });
    });

    Packer.toBlob(doc).then((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "questions.docx";
      link.click();
    });
  };

  return (
    <div className="container flex-column">
      <h1>Questions</h1>
      {error && <p className="error-message">{error}</p>}
      {questions.length > 0 ? (
        <div>
          {questions.map((question, index) => (
            <div className="question-card" key={question.id}>
              <p className="question-text">{`Q${index + 1}: ${question.questionText}`}</p>
              <ul className="options-list">
                {Object.entries(question.options).map(([key, value]) => (
                  <li key={key} className="option">
                    {key}: {value}
                  </li>
                ))}
              </ul>
              <div className="answer-info">
                <p>
                  <strong>Answer:</strong> {question.answer}
                </p>
                <p>
                  <strong>Year:</strong> {question.year}
                </p>
              </div>
            </div>
          ))}
          <div className="export-buttons">
            <button onClick={exportToPDF} className="export-btn">
              Export to PDF
            </button>
            <button onClick={exportToDOC} className="export-btn">
              Export to DOCX
            </button>
          </div>
        </div>
      ) : (
        <p>No questions available</p>
      )}
    </div>
  );
};

QuestionsPage.propTypes = {
  questions: PropTypes.array,
};

export default QuestionsPage;