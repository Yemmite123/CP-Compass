import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

const NotFound = () => {
  return (
    <div className="no-found-page">
      <div className="w-50 text-center box">
        <img src={require('#/assets/icons/404.svg')} alt="404" className="img-fluid w-25"/>
        <h2 className="mt-5">Page not found</h2>
        <p>Go back to the <Link to="/login">login</Link></p>
      </div>
    </div>
  )
}

export default NotFound;
