import React from 'react';
import moment from 'moment';
import './style.scss';

const BlogItem = ({ item, category, navigateToItem, navigateToCategory }) => {

  const handleSingleItem = () => {
    navigateToItem(item)
  }

  return (
    <div className="blog-item">
      <div>
        <img src={item.image} alt="feature" className="img-fluid" />
        <div className="blog-info pb-5 pt-4">
          <div className="content">
            <h4 onClick={handleSingleItem} className="cursor-pointer font-weight-normal">{item.title}</h4>
            <div className="d-flex align-items-center my-3">
              <img src={item.user.pictureUrl} alt="feature" className="img-fluid profile-photo" />
              <p className="text-grey text-small mb-0 ml-2">{item.user.firstName} {item.user.lastName} on {moment(item.created_at).format('MMMM Do YYYY')}</p>
            </div>
            <p className="blog-description">{item.description.length > 60 ? `${item.description.substring(0, 60)}...` : item.description}</p>
          </div>
          <span className={`blog-category-${item.category?.name} cursor-pointer`} onClick={null}>
            {item.category?.name}
          </span>
        </div>
      </div>
    </div>
  )
}

export default BlogItem;
