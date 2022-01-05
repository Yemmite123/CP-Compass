import React from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment';
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/blog/actionTypes";
import { getRecentPosts, filterPosts } from '#/store/blog/actions'
import BlogItem from '#/components/BlogItem';
import Back from '#/components/Back';
import './style.scss';
import MainBlogItem from '#/components/MainBlogitem';


class LatestInsights extends React.Component {

  state = {
    page: 1,
    limit: 10,
    search: '',
    searchPage: 1,
    searchLimit: 10,
  }

  componentDidMount() {
    this.props.getRecentPosts(10, 1);
  }

  handleNavigateToPost = (insight) => {
    this.props.history.push({
      pathname: `/app/insights/insight/${insight.slug}`,
      state: { routeName: insight.title }
    })
  }

  handleChange = (event) => {
    const { name, value } = event.target
    this.setState({ [name]: value }, () => {
      if (name === 'search') {
        this.props.filterPosts(value, 1, 10);
      }
    });
  }

  handleLoadMore = () => {
    this.setState({ page: 1, limit: this.state.limit + 10 }, () => {
      this.props.getRecentPosts(this.state.limit, this.state.page);
    })
  }

  loadMoreSearch = () => {
    this.setState({ searchPage: 1, limit: this.state.searchLimit + 10 }, () => {
      this.props.filterPosts(this.state.search, this.state.searchPage, this.state.searchLimit);
    })
  }

  render() {
    const { recent, loading, filter, searchloading } = this.props;
    const { search } = this.state;

    return (
      <div className="insights-category-page">
        <div className="d-flex justify-content-between">
          <Back />
        </div>
        {search === '' &&
          <>
            {loading &&
              <div className="text-center mt-3">
                <div className="spinner-border text-blue spinner-border-md ml-2"></div>
              </div>
            }

            {recent?.data.length > 0 &&
          <div className="row mt-3 no-gutters">
          <div className="col-md-5">
                <div className="main-blog-img-container">
                  <img src={recent?.data[0]?.image} alt="feature" className="img-fluid main-blog-img" />
                </div>
                </div>
                <div className="col-md-7">
                <div className="blog-info-main p-4">
                  <div className="content mb-3">
                    <h4 className="cursor-pointer font-weight-normal" onClick={() => this.handleNavigateToPost(recent?.data[0])}>{recent?.data[0].title}</h4>
                    <div className="d-flex align-items-center my-3">
                      <img src={recent?.data[0]?.user.pictureUrl} alt="feature" className="img-fluid profile-photo" />
                      <p className="text-grey text-small mb-0 ml-2">{recent?.data[0].user.firstName} {recent?.data[0].user.lastName} on {moment(recent?.data[0].created_at).format('MMMM Do YYYY')}</p>
                    </div>
                    <div>{recent?.data[0]?.description}...</div>
                  </div>
                  <span className={`blog-category-${recent?.data[0]?.category?.name} cursor-pointer`} onClick={() => this.handleNavigateToCategory()}>
                    {recent?.data[0]?.category?.name}
                  </span>
                </div>
                </div>
              </div>
            }

            {recent?.data.length > 0 &&
              <h2 className={`text-left text-black pt-5 mt-3`}>All Latest articles</h2>
            }

            <div className="row">
              {recent?.data &&
                (recent?.data.length > 0 ?
                  recent?.data.map(blogpost => (
                    <div className="col-md-12 mt-4" key={blogpost.id}>
                      <MainBlogItem item={blogpost} navigateToItem={this.handleNavigateToPost} />
                    </div>
                  ))
                  :
                  <div className="text-center">
                    No recent topics
            </div>)
              }
            </div>
            {recent?.data &&
              <div className="text-center mt-4 mb-4">
                {recent?.data.length !== recent?.total &&
                  <button className="btn btn-stroke-black btn-sm text-center" onClick={this.handleLoadMore}>
                    Load more
              {loading &&
                      <div className="spinner-border text-black spinner-border-sm ml-2"></div>
                    }
                  </button>
                }
              </div>
            }
          </>
        }
        {search !== '' &&
          <>
            <h3 className="text-center text-blue text-medium mb-3">Search Results</h3>
            {searchloading &&
              <div className="text-center">
                <div className="spinner-border text-blue spinner-border-md ml-2"></div>
              </div>
            }
            <div className="row">
              {filter &&
                (filter?.posts?.data.length > 0 ?
                  filter?.posts?.data.map(blogpost => (
                    <div className="col-md-4" key={blogpost.id}>
                      <BlogItem item={blogpost} navigateToItem={this.handleNavigateToPost} />
                    </div>
                  ))
                  :
                  <div className="text-center w-100 mt-5">
                    <p className="text-grey mt-5">No results for {search}</p>
                  </div>
                )
              }
            </div>
            {filter?.posts?.total > filter?.posts?.data.length &&
              <div className="text-center mt-4">
                <button className="btn btn-stroke-black btn-sm text-center" onClick={this.loadMoreSearch}>
                  Load more
                </button>
              </div>
            }
          </>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { app: {
    blog: { recent, filter }
  } } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.GET_RECENT_POSTS_REQUEST),
    searchloading: getActionLoadingState(state, actionTypes.FILTER_POSTS_REQUEST),
    recent,
    filter
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getRecentPosts: (limit, page) => dispatch(getRecentPosts(limit, page)),
    filterPosts: (search, limit, page) => dispatch(filterPosts(search, limit, page)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LatestInsights));