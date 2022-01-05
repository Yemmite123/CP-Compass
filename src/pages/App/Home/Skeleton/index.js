import React from 'react';
import Card from '#/components/Card';
import './style.scss';

const HomeSkeleton = () => {

  return (
    <div className="home-skeleton">
      <div className="welcome"></div>
      <div className="overview mt-5"></div>
      <div className="row mt-5">
        <div className="col-md-4">
          <Card classes="">
            <div className="label"></div>
            <div className="min-label"></div>
          </Card>
        </div>
        <div className="col-md-4">
          <Card classes="">
            <div className="label"></div>
            <div className="min-label"></div>
          </Card>
        </div>
        <div className="col-md-4">
          <Card classes="">
            <div className="label"></div>
            <div className="min-label"></div>
          </Card>
        </div>
      </div>
      <div className="invest"></div>
      <div className="row mt-5">
        <div className="col-md-4">
          <Card classes="">
            <div className="label"></div>
            <div className="min-label"></div>
          </Card>
        </div>
        <div className="col-md-4">
          <Card classes="">
            <div className="label"></div>
            <div className="min-label"></div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default HomeSkeleton;
