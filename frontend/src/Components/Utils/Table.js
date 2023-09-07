import React from 'react';

const Table = (props) => {
  return (
    <div className="flex w-full flex-col overflow-x-auto">
      <table className={`table table-hover font-medium ${props.className}`}>{props.children}</table>
      {props.loading && props.loading === true && (
        <div className="relative h-80">
          <div className="loader-wrapper">
            <svg className="spinner-ring" viewBox="25 25 50 50" strokeWidth="5">
              <circle cx="50" cy="50" r="20" />
            </svg>
          </div>
        </div>
      )}

      {props.error && props.error !== '' && (
        <div className="relative h-80">
          <div className="error text-error">{props.error}</div>
        </div>
      )}
    </div>
  );
};

export default Table;
