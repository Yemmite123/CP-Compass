import React from 'react';
import './style.scss';

const InsightSkeleton = () => {

  return (
    <div className="insight-skeleton">
      <div className="row mt-5">
        <div className="col-md-4">
          <div className="insight-item">
            <div className="insight-img"></div>
            <div className="content">
              <div className="min-label"></div>
              <div className="label"></div>
              <div className="mid-label"></div>
              <div className="mid-label"></div>
              <div className="min-label"></div>
            </div>
          </div>
          <div className="btn-item"></div>
        </div>
        <div className="col-md-4">
          <div className="insight-item">
            <div className="insight-img"></div>
            <div className="content">
              <div className="min-label"></div>
              <div className="label"></div>
              <div className="mid-label"></div>
              <div className="mid-label"></div>
              <div className="min-label"></div>
            </div>
          </div>
          <div className="btn-item"></div>
        </div>
        <div className="col-md-4">
          <div className="insight-item">
            <div className="insight-img"></div>
            <div className="content">
              <div className="min-label"></div>
              <div className="label"></div>
              <div className="mid-label"></div>
              <div className="mid-label"></div>
              <div className="min-label"></div>
            </div>
          </div>
          <div className="btn-item"></div>
        </div>
      </div>
    </div>
  )
}

export default InsightSkeleton;
