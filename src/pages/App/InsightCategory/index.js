import React from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/blog/actionTypes";
import { getLatestPosts, getCategoryPosts, filterPosts } from '#/store/blog/actions'
import BlogItem from '#/components/BlogItem';
import moment from 'moment';
import DashboardBodyMenu from '#/components/DashboardBodyMenu';
import './style.scss';
import MainBlogItem from '#/components/MainBlogitem';

class InsightCategory extends React.Component {

  state = {
    page: 1,
    limit: 10,
    search: '',
    searchPage: 1,
    searchLimit: 10,
  }

  componentDidMount() {
    const { match: { params } } = this.props;
    this.props.getCategoryPosts(params.slug, 1, 10);
    this.props.getLatestPosts(10, 1);
  }

  componentDidUpdate(prevProps) {
    const { match: { params } } = this.props;
    if(prevProps.match.url !== this.props.match.url) {
      this.props.getCategoryPosts(params.slug, 1, 10);
    }
  }

  handleNavigateToPost = (insight) => {
    this.props.history.push({
      pathname: `/app/insights/insight/${insight.slug}`,
      state: { routeName: insight.title }
    })
  }

  handleLoadMore = () => {
    const { match: { params } } = this.props;
    this.setState({ page: 1, limit: this.state.limit + 10 }, () => {
      this.props.getCategoryPosts(params.slug, this.state.page, this.state.limit);
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

  loadMoreSearch = () => {
    this.setState({ searchPage: 1, limit: this.state.searchLimit + 10 }, () => {
      this.props.filterPosts(this.state.search, this.state.searchPage , this.state.searchLimit );
    })
  }

  render() {
    const { category, loading, location, filter, searchloading, posts } = this.props;
    const { search } = this.state;

    const defaultMenu = [
      {
        name: 'Home',
        path: '/app/insights',
        title: 'Insights',
      },
      {
        name: 'Trending Topics',
        path: '/app/insights/trending',
        title: 'Trending',
      }
    ]
    const menus = posts?.category?.map(item => ({
      name: item.name,
      path: `/app/insights/category/${item.slug}`,
      title: item.name,
    }))

    return (
      <div className="insights-category-page">
        <div className="d-flex justify-content-between">
          {posts?.category && <DashboardBodyMenu menus={[...defaultMenu, ...menus]} />}
        </div>
          <>
            {loading &&
              <div className="text-center mt-3">
                <div className="spinner-border text-blue spinner-border-md ml-2"></div>
              </div>
            }
            {category?.posts?.data.length > 0 &&
          <div className="row mt-3 no-gutters">
          <div className="col-md-5">
                <div className="main-blog-img-container">
                  <img src={category?.posts?.data[0].image} alt="feature" className="img-fluid main-blog-img" />
                </div>
                </div>
                <div className="col-md-7">
                <div className="blog-info-main p-4">
                  <div className="content mb-3">
                    <h4 className="cursor-pointer font-weight-normal" onClick={() => this.handleNavigateToPost(category?.posts?.data[0])}>{category?.posts?.data[0].title}</h4>
                    <div className="d-flex align-items-center my-3">
                      <img src={category?.posts?.data[0].user.pictureUrl} alt="feature" className="img-fluid profile-photo" />
                      <p className="text-grey text-small mb-0 ml-2">{category?.posts?.data[0].user.firstName} {category?.posts?.data[0].user.lastName} on {moment(category?.posts?.data[0].created_at).format('MMMM Do YYYY')}</p>
                    </div>
                    <div>{category?.posts?.data[0].description}...</div>
                  </div>
                  <span className={`blog-category-${category?.posts?.data[0].category.name} cursor-pointer`} onClick={() => this.handleNavigateToCategory()}>
                    {category?.posts?.data[0].category.name}
                  </span>
                </div>
                </div>
              </div>
            }

            {category?.posts?.data.length > 0 && 
            <h2 className={`text-left text-black pt-5 mt-3`}>All {category?.posts?.data[0].category.name} articles</h2>
            }

            <div className="row">
              {category?.posts &&
                (category?.posts?.data.length > 0 ?
                  category?.posts?.data.map(blogpost => (
                    <div className="col-md-12 mt-4" key={blogpost.id}>
                      <MainBlogItem item={blogpost} navigateToItem={this.handleNavigateToPost} />
                    </div>
                  ))
                  :
                  <div className="text-center w-100 mt-5">
                    No {location.state?.category && location.state?.category.name} posts
                </div>
                )
              }
            </div>
            {category?.posts &&
              <div className="text-center mt-4">
                {category?.posts?.total > category?.posts?.data.length &&
                  <button className="btn btn-stroke btn-sm text-center" onClick={this.handleLoadMore}>
                    Load more
                    {loading &&
                      <div className="spinner-border text-blue spinner-border-sm ml-2"></div>
                    }
                  </button>
                }
              </div>
            }
          </>
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
                <button className="btn btn-stroke btn-sm text-center" onClick={this.loadMoreSearch}>
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
    blog: { posts, category, filter }
  } } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.GET_CATEGORY_POSTS_REQUEST),
    searchloading: getActionLoadingState(state, actionTypes.FILTER_POSTS_REQUEST),
    category,
    filter,
    posts,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getLatestPosts: (limit, page) => dispatch(getLatestPosts(limit, page)),
    getCategoryPosts: (slug, page, limit) => dispatch(getCategoryPosts(slug, page, limit)),
    filterPosts: (search, limit, page) => dispatch(filterPosts(search, limit, page)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InsightCategory));