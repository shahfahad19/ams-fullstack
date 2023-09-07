import React, { useState } from 'react';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';

const Search = () => {
  const [searchData, setSearchData] = useState();

  return (
    <div className="p-2">
      {/* {!searchData && <SearchForm setSearchData={setSearchData} />} */}
      <SearchForm setSearchData={setSearchData} />
      {searchData && <SearchResults searchData={searchData} />}
    </div>
  );
};

export default Search;
