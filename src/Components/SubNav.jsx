import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SubNav = ({title, titles, allTitleLink, addNewTitleLink, searchTitle, searchContent}) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      <h2 style={{ marginTop: '80px', marginBottom: '10px' }}>{titles}</h2>
      <div style={{ display: 'flex', gap: '30px', marginBottom: '20px', fontSize: '18px' }}>
        <Link to={`/${allTitleLink}`}>All {titles}</Link>
        <Link to={`/${addNewTitleLink}`}>Add New {title}</Link>
        <span style={{ position: 'relative', bottom: '5px' }}>
          <form className="d-flex input-group w-auto">
            <input
              type="search"
              className="form-control rounded"
              placeholder={`Search ${title} by ${searchContent}`}
              aria-label="Search"
              aria-describedby="search-addon"
              style={{ width: '500px' }}
              name="searchQuery"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Link to={`/${searchTitle}/${searchQuery}`}>
              <span className="input-group-text border-0" id="search-addon">
                <button style={{ border: 'none' }}>
                  <i className="fas fa-search"></i>
                </button>
              </span>
            </Link>
          </form>
        </span>
      </div>
    </div>
  );
};

export default SubNav;
