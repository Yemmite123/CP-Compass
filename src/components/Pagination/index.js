import React, { Component } from "react";
import { ReactComponent as BackArrrow } from '#/assets/icons/previous-page-arrow.svg';
import { ReactComponent as NextArrrow } from '#/assets/icons/next-page-arrow.svg';
import './style.scss';

class Pagination extends Component {
    backClick = () => {
        const { page, limit } = this.props;
        if(page === 1) return;
        this.props.changePageHandler(limit, page - 1);
    }

    nextClick = () => {
        const { page, limit } = this.props;
        if(page === this.props.totalPages) return;
        this.props.changePageHandler(limit, page + 1);
    }

    onInputChange = (e) => {
        this.props.changePageHandler(e.target.value, 1);
    }

    render() {
        const { totalPages, page, limit} = this.props;
        return(
            <div className="cp-pagination">
                <div className="cp-pagination__limit">
                    <span className="font-md cp-pagination__text">Show</span>
                    <select
                        className="mx-2 text-small"
                        onChange={this.onInputChange}
                        value={limit}
                    >
                        <option>5</option>
                        <option>10</option>
                        <option>20</option>
                        <option>40</option>
                        <option>60</option>
                    </select>
                    <span className="font-md">entries</span>
                </div>
                <BackArrrow 
                    className={`cp-pagination__arrow ${page > 1 ? 'cp-pagination__arrow--active' : ''}`}
                    onClick={this.backClick}
                /> 
                <span className="font-md mx-5">
                    <span className="font-weight-bold">
                        {page} of {totalPages}
                    </span> pages
                </span>
                <NextArrrow
                    className={`cp-pagination__arrow ${page < totalPages ? 'cp-pagination__arrow--active' : ''}`}
                    onClick={this.nextClick}
                />
            </div>
        )
    }
}

export default Pagination;
