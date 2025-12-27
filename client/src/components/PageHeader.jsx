import React from 'react';
import './PageHeader.css';

const PageHeader = ({ title, onSearch, onNew }) => {
  return (
    <div className="page-header">
      <div className="header-top">
        <button className="btn-new" onClick={onNew}>New</button>
        <h1 className="page-title">{title}</h1>
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search..." 
            className="search-input"
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="header-controls">
        {/* Mock controls for Sort/Filter/Group By as seen in Odoo */}
        <div className="control-group">
          <span className="control-label">Filters</span>
          <span className="control-icon">▼</span>
        </div>
        <div className="control-group">
          <span className="control-label">Group By</span>
          <span className="control-icon">▼</span>
        </div>
        <div className="control-group">
          <span className="control-label">Favorites</span>
          <span className="control-icon">▼</span>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
