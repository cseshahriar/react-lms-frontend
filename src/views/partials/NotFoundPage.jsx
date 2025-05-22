import BaseHeader from './BaseHeader'
import BaseFooter from './BaseFooter'

import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <>
      <BaseHeader/>

      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center">
        <h1 className="display-1 fw-bold text-danger">404</h1>
        <h2 className="mb-3">Page Not Found</h2>
        <p className="lead text-muted mb-4">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          Go to Homepage
        </Link>
      </div>

      <BaseFooter/>
    </>
  );
};

export default NotFoundPage;
