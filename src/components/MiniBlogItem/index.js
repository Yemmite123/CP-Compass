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
            <h4 onClick={handleSingleItem} className="font-weight-bold cursor-pointer">{item.title}</h4>
            <div className="d-flex align-items-center my-3">
              {item.user.pictureUrl ?
                <img src={item.user.pictureUrl} alt="feature" className="img-fluid profile-photo" />
                : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                </svg>
              }
              <p className="text-grey text-small mb-0 ml-2">{item.user.firstName} {item.user.lastName} on {moment(item.created_at).format('MMM DD, YYYY')}</p>
            </div>
            <p className="blog-description font-weight-light ">{item.description.length > 60 ? `${item.description.substring(0, 60)}...` : item.description}</p>
          </div>
          <span className={`blog-category blog-category-${item.category?.name} cursor-pointer`} onClick={() => navigateToCategory(item.category?.name)}>
            {item.category?.name}
          </span>
        </div>
      </div>
    </div>
  )
}

export default MiniBlogItem;
