import React from 'react';
import Card from '#/components/Card';
import './style.scss';

const MarketSkeleton = () => {

  return (
    <div className="market-skeleton">
      <div className="row mt-5">
        <div className="col-md-4">
          <Card classes="">
            <div className="label"></div>
            <div className="min-label"></div>
            <div className="d-flex justify-content-end">
              <div className="img"></div>
            </div>
          </Card>
        </div>
        <div className="col-md-4">
          <Card classes="">
            <div className="label"></div>
            <div className="min-label"></div>
            <div className="d-flex justify-content-end">
              <div className="img"></div>
            </div>
          </Card>
        </div>
        <div className="col-md-4">
          <Card classes="">
            <div className="label"></div>
            <div className="min-label"></div>
            <div className="d-flex justify-content-end">
              <div className="img"></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default MarketSkeleton;
