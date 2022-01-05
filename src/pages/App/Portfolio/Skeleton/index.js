import React from 'react';
import Card from '#/components/Card';
import './style.scss';

const PortfolioSkeleton = () => {

  return (
    <div className="portfolio-skeleton">
      <div className="row mt-5">
        <div className="col-lg-6">
          <Card classes="portfolio-item">
            <div className="label"></div>
            <div className="min-label"></div>
            <div className="d-flex justify-content-between">
              <div>
                <div className="min-label"></div>
                <div className="min-label"></div>
              </div>
              <div className="circle"></div>
            </div>
          </Card>
        </div>
        <div className="col-lg-6">
        <Card classes="portfolio-item">
            <div className="label"></div>
            <div className="min-label"></div>
            <div className="d-flex justify-content-between">
              <div>
                <div className="min-label"></div>
                <div className="min-label"></div>
              </div>
              <div className="circle"></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PortfolioSkeleton;
