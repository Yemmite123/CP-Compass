import React from 'react';
import moment from 'moment';
import './style.scss';

const MiniBlogItem = ({ item, category, navigateToItem, navigateToCategory }) => {

  const handleSingleItem = () => {
    navigateToItem(item)
  }

  return (
    <div className="mini-blog-item">
      <div>
        <div className="blog-info pb-4">
          <div className="content">
            <h4 onClick={handleSingleItem} className="cursor-pointer">{item.title}</h4>
            <div className="d-flex align-items-center my-3">
              <img src={item.user.pictureUrl} alt="feature" className="img-fluid profile-photo" />
              <p className="text-grey text-small mb-0 ml-2">{item.user.firstName} {item.user.lastName} on {moment(item.created_at).format('MMM DD, YYYY')}</p>
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

export default MiniBlogItem;
