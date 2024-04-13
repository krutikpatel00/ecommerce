import React from 'react';
import './ErrorPage.css'; // Import your custom CSS file

const ErrorPage = ({ error }) => {
      return (
            <div className="error-container">
                  <h1 className="error-title">Error 404 </h1>
                  <p className="error-message">{error}</p>

                  {/* You can customize this with more details or additional content */}
            </div>
      );
}

export default ErrorPage;
