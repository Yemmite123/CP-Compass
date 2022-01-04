import React from 'react';
import { withRouter } from "react-router-dom";
import InvestmentPortfolio from '#/components/InvestmentPortfolio';
import Card from '#/components/Card';
import PortfolioSkeleton from '../Skeleton';
import './style.scss';

class TermedInvestments extends React.Component {

  handleClickItem = (investmentId) => {
    this.props.history.push({
      pathname: `/app/portfolio/investment/${investmentId}`,
      state: { routeName: 'Portfolio' },
    })
  }

  render() {
    const { investments, loading } = this.props
    return (
      <div className="portfolio-termed-investment">
        {loading && !investments && <PortfolioSkeleton />}
        <div className="row">
          {
            investments && investments.length > 0 ? investments.map(investment => (
              <div className="col-lg-6 mt-2" key={investment.id}>
                <Card classes="card portfolio-item cursor-pointer" onclick={() => this.handleClickItem(investment.id)}>
                  <InvestmentPortfolio item={investment} navigateToItem={this.handleClickItem} />
                </Card>
              </div>
            ))
            :
            (!loading &&
              <div className="text-center w-100">
                <p className="font-light text-grey mt-3">No investments available</p>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

export default withRouter(TermedInvestments);
