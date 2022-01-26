import React from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment';
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/blog/actionTypes";
import { getLatestPosts, filterPosts } from '#/store/blog/actions'
import BlogItem from '#/components/BlogItem';
import DashboardBodyMenu from '#/components/DashboardBodyMenu';
import { ReactComponent as Arrow } from '#/assets/icons/goto-news.svg';
import './style.scss';
import InsightSkeleton from './Skeleton';
import MiniBlogItem from '#/components/MiniBlogItem';

class Insights extends React.Component {

  state = {
    search: '',
    searchPage: 1,
    searchLimit: 10,
  }

  componentDidMount() {
    this.props.getLatestPosts(10, 1);
  }

  handleChange = (event) => {
    const { name, value } = event.target
    this.setState({ [name]: value }, () => {
      if (name === 'search') {
        this.props.filterPosts(value, 1, 10);
      }
    });
  }

  handleNavigateToPost = (insight) => {
    this.props.history.push({
      pathname: `/app/insights/insight/${insight.slug}`,
      state: { routeName: insight.title }
    })
  }

  handleNavigateToCategory = (category) => {
    this.props.history.push({
      pathname: `/app/insights/category/${category.slug}`,
      state: { routeName: category.name, category }
    })
  }

  navigateToTrending = () => {
    this.props.history.push({
      pathname: `/app/insights/trending`,
      state: { routeName: 'Trending Posts' }
    })
  }

  navigateToLatest = () => {
    this.props.history.push({
      pathname: `/app/insights/latest`,
      state: { routeName: 'Latest Posts' }
    })
  }

  loadMoreSearch = () => {
    this.setState({ searchPage: 1, limit: this.state.searchLimit + 10 }, () => {
      this.props.filterPosts(this.state.search, this.state.searchPage, this.state.searchLimit);
    })
  }

  render() {
    const { posts, loading } = this.props;

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
      <div className="insights-page">
        <div className="d-flex justify-content-start overflow-auto">
          {posts?.category && <DashboardBodyMenu menus={[...defaultMenu, ...menus]} />}
        </div>
        {loading && !posts && <InsightSkeleton />}

        {posts &&

          <div className="row mt-3 no-gutters">
            <div className="col-md-5">
            <div className="main-blog-img-container">
              <img src={posts.latest ? posts.latest[0].image : ""} alt="feature" className="img-fluid main-blog-img" />
            </div>
            </div>
<div className="col-md-7">
            <div className="blog-info-main p-4">
              <div className="content mb-3">
                <h4 className="cursor-pointer font-weight-normal">{posts.latest[0].title}</h4>
                <div className="d-flex align-items-center my-3">
                  <img src={posts.latest[0].user.pictureUrl} alt="feature" className="img-fluid profile-photo" />
                  <p className="text-grey text-small mb-0 ml-2">{posts.latest[0].user.firstName} {posts.latest[0].user.lastName} on {moment(posts.latest[0].created_at).format('MMMM Do YYYY')}</p>
                </div>
                <div>{posts.latest[0].description}...</div>
              </div>
              <span className={`blog-category-${posts.latest[0].category.name} cursor-pointer`} onClick={() => this.handleNavigateToCategory()}>
                {posts.latest[0].category.name}
              </span>
            </div>
          </div>
          </div>
        }

        {posts &&
          <h2 className="text-left text-black mb-4 mt-5">Latest Topics</h2>}
        <div className="row">
          {posts &&
            (posts?.latest?.length > 0 ?
              posts?.latest?.map(blogpost => (
                <div className="col-md-4" key={blogpost.id}>
                  <BlogItem item={blogpost} navigateToItem={this.handleNavigateToPost} navigateToCategory={this.handleNavigateToCategory} />
                </div>
              ))
              :
              <div className="text-center w-100 mt-2">
                <p className="text-grey mt-5">No Latest topics</p>
              </div>)
          }
        </div>
        {posts?.latest.length > 0 &&
          <div className="text-center mt-4">
            <button className="btn btn-stroke-black btn-sm text-center" onClick={this.navigateToLatest} >
              See more
            </button>
          </div>
        }

        {posts &&
          <h2 className={`text-left text-black mb-4 ${posts?.latest ? 'mt-5' : 'mt-5'}`}>Trending Topics</h2>}
        <div className="row">
          {posts &&
            (posts?.trending.length > 0 ?
              posts?.trending.map(blogpost => (
                <div className="col-md-4" key={blogpost.id}>
                  <BlogItem item={blogpost} navigateToItem={this.handleNavigateToPost} />
                </div>
              ))
              :
              <div className="text-center w-100 mt-5">
                <p className="text-grey mt-5">No Trending topics</p>
              </div>)
          }
        </div>
        {posts?.trending.length > 0 &&
          <div className="text-center mt-4">
            <button className="btn btn-stroke-black btn-sm text-center" onClick={this.navigateToTrending}>
              See more
            </button>
          </div>
        }

        {posts && posts?.category?.length > 0
          && posts?.category.filter(item => item?.posts.length > 0).map(item => (
            <div className="pt-5 mb-4" key={item.id}>
              {item && item?.posts.length > 0 &&
                <div className="d-flex justify-content-between mb-4">
                  <div className="d-flex align-items-center">
                    <span className={`bar-${item.name}`} /><h4 className="text-center font-light text-black ml-2 mb-0">{item.name}</h4>
                  </div>
                  <div className={`${item.name} cursor-pointer`} onClick={() => this.handleNavigateToCategory(item)}>All {item.name} articles <Arrow /> </div>
                </div>
              }
              <div className="row">
                {item && item?.posts.length > 0 &&
                  <div className="col-md-5">
                    <BlogItem item={item?.posts[0]} category={item.name} navigateToItem={this.handleNavigateToPost} navigateToCategory={this.handleNavigateToCategory} />
                  </div>
                }
                <div className="col-md-7">
                  {item && item?.posts.length > 0 &&
                    item?.posts.slice(1, 2)
                      .map((blogpost, i) => (
                        <>
                          <MiniBlogItem item={blogpost} category={item.name} navigateToItem={this.handleNavigateToPost} navigateToCategory={this.handleNavigateToCategory} />
                          {i !== item?.posts.length - 1 && <hr />}
                        </>
                      ))}
                </div>
              </div>
            </div>
          ))}
        
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { app: {
    blog: { posts, filter }
  } } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.GET_LATEST_POSTS_REQUEST),
    searchloading: getActionLoadingState(state, actionTypes.FILTER_POSTS_REQUEST),
    posts,
    filter,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getLatestPosts: (limit, page) => dispatch(getLatestPosts(limit, page)),
    filterPosts: (search, limit, page) => dispatch(filterPosts(search, limit, page)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Insights));
