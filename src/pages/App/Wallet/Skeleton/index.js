import React from 'react';
import Card from '#/components/Card';
import './style.scss';

const WalletSkeleton = () => {

  return (
    <div className="wallet-skeleton">
      <Card classes="mt-5">
        <div className="row">
          <div className="col-md-3">
            <div className="min-label"></div>
            <div className="item"></div>
          </div>
          <div className="col-md-3">
            <div className="min-label"></div>
            <div className="item"></div>
          </div>
        </div>
      </Card>

      <Card classes="mt-5">
        <div className="transactions-head"></div>
        <hr />
        <div className="min-label"></div>
        <div className="d-flex mt-2 justify-content-between">
          <div className="d-flex">
            <div className="circle"></div>
            <div className="ml-3">
              <div className="mid-label"></div>
              <div className="min-label mt-2"></div>
            </div>
          </div>
          <div className="min-label"></div>
        </div>
        <hr />
        <div className="d-flex mt-2 justify-content-between">
          <div className="d-flex">
            <div className="circle"></div>
            <div className="ml-3">
              <div className="mid-label"></div>
              <div className="min-label mt-2"></div>
            </div>
          </div>
          <div className="min-label"></div>
        </div>
      </Card>
    </div>
  )
}

export default WalletSkeleton;
