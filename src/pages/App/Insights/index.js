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
      pathname: `/app/blogs/blog/${insight.slug}`,
      state: { routeName: insight.title }
    })
  }

  handleNavigateToCategory = (category) => {
    let path = category.toLowerCase().replaceAll(" ", "-");
    this.props.history.push({
      pathname: `/app/blogs/category/${path}`,
      state: { routeName: category, path }
    })
  }

  navigateToTrending = () => {
    this.props.history.push({
      pathname: `/app/blogs/trending`,
      state: { routeName: 'Trending Posts' }
    })
  }

  navigateToLatest = () => {
    this.props.history.push({
      pathname: `/app/blogs/latest`,
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
        name: 'Trending',
        path: '/app/blogs',
        title: 'Blog',
      },
      // {
      //   name: 'Trending',
      //   path: '/app/blogs/trending',
      //   title: 'Trending',
      // }
    ]
    const menus = posts?.category?.map(item => ({
      name: item.name,
      path: `/app/blogs/category/${item.slug}`,
      title: item.name,
    }))

    return (
      <div className="insights-page">
        <div className="d-flex justify-content-start overflow-auto">
          {posts?.category.length ? <DashboardBodyMenu menus={[...defaultMenu, ...menus]} /> : <></>}
        </div>
        {loading && !posts && <InsightSkeleton />}

        {posts?.trending.length ?

          <div className="row mt-3 no-gutters">
            <div className="col-md-5">
              <div className="main-blog-img-container">
                <img src={posts.trending[0].image} alt="feature" className="img-fluid main-blog-img" />
              </div>
            </div>
            <div className="col-md-7">
              <div className="blog-info-main p-4">
                <div className="content mb-3">
                  <h3 className="font-weight-bold">{posts.trending[0].title}</h3>
                  <div className="d-flex align-items-center my-3">
                    {posts.trending[0].user.pictureUrl ?
                      <img src={posts.trending[0].user.pictureUrl} alt="feature" className="img-fluid profile-photo" />
                      : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                      </svg>
                    }
                    <p className="text-small font-weight-bold mb-0 ml-2">{posts.trending[0].user.firstName} {posts.trending[0].user.lastName} on {moment(posts.trending[0].created_at).format('MMMM Do YYYY')}</p>
                  </div>
                  <div> <p className="font-weight-light my-4">  {posts.trending[0].description}...</p></div>
                </div>
                <span className={`blog-category blog-category-${posts.trending[0].category.name} cursor-pointer`} onClick={() => this.handleNavigateToCategory(posts.trending[0].category.name)}>
                  {posts.trending[0].category.name}
                </span>
              </div>
            </div>
          </div>
          : <></>
        }

        {posts &&
          <h3 className={`text-left text-black mb-4 ${posts?.latest ? 'mt-5' : 'mt-5'}`}>Trending Topics</h3>}
        <div className="row">
          {posts &&
            (posts?.trending.length > 0 ?
              posts?.trending.map(blogpost => (
                <div className="col-md-4" key={blogpost.id}>
                  <BlogItem item={blogpost} className="small-img" navigateToItem={this.handleNavigateToPost} navigateToCategory={this.handleNavigateToCategory} />
                </div>
              ))
              :
              <div className="text-center w-100 mt-5">
                <p className="text-grey mt-5 text-center">No Trending topics</p>
              </div>)
          }
        </div>
        {/* {posts?.trending.length > 0 &&
          <div className="text-center mt-4">
            <button className="btn btn-stroke-black btn-sm rounded text-center" onClick={this.navigateToTrending}>
              Show more
            </button>
          </div>
        } */}

        {posts && posts?.category?.length > 0
          && posts?.category.filter(item => item?.posts.length > 0).map((item, index) => (
            <div className="mb-5" key={item.id}>
              {item && item?.posts.length > 0 &&
                <div className="d-flex justify-content-between mb-4">
                  <div className="d-flex align-items-center">
                    <h3 className={`text-left text-black pl-2`} style={{ borderLeft: `5px solid ${(index + 1) % 2 ? "green" : "#6152BD"}` }}>{item.name}</h3>
                  </div>
                  <div className={`${item.name} align-self-center  cursor-pointer`} style={{ color: "#AD3336" }} onClick={() => { this.handleNavigateToCategory(item?.name) }}>All {item.name} articles <Arrow /> </div>
                </div>
              }
              <div className="row">
                {item && item?.posts.length > 0 &&
                  <div className="col-md-5">
                    <BlogItem item={item?.posts[0]} className="small-img" category={item.name} navigateToItem={this.handleNavigateToPost} navigateToCategory={this.handleNavigateToCategory} />
                  </div>
                }
                <div className="col-md-7">
                  {item && item?.posts.length > 0 &&
                    item?.posts.slice(1, 2)
                      .map((blogpost, i) => (
                        <>
                          <MiniBlogItem item={blogpost} category={item.name} navigateToItem={this.handleNavigateToPost} navigateToCategory={this.handleNavigateToCategory} />
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
