import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../Context/AppContext';
import Table from '../Utils/Table';
import { CheckIcon, CrossIcon } from '../Utils/Icons';

const SearchResults = ({ searchData }) => {
  const ctx = useContext(AppContext);
  const role = searchData.user;
  const [searchResults, setSearchResults] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setSearchResults(undefined);
    setIsLoading(true);
    setErrorMessage('');
    axios
      .get(
        `${ctx.baseURL}/users/search?role=${searchData.user}&${searchData.searchBy}=${searchData.query}`,
        {
          credentials: 'include'
        }
      )
      .then((response) => {
        setIsLoading(false);
        setSearchResults(response.data.data.users);
      })
      .catch((error) => {
        setIsLoading(false);
        setErrorMessage(ctx.computeError(error));
      });
  }, [searchData]);

  const viewUser = (user) => {
    ctx.navigate(`${ctx.userData.role}/${user.role}/${user._id}`);
  };
  return (
    <>
      <Table loading={isLoading} error={errorMessage}>
        <thead>
          <tr>
            {role === 'student' && (
              <>
                <th>Roll No</th>
                <th>Name</th>
                {ctx.userData.role === 'super-admin' && <th>Department</th>}
                <th>Email</th>
                <th>Account confirmed</th>
              </>
            )}

            {role === 'teacher' && (
              <>
                <th>#</th>
                <th>Name</th>
                {ctx.userData.role === 'super-admin' && <th>Department</th>}
                <th>Email</th>
                <th>Gender</th>
                <th>Designation</th>
                <th>Account approved</th>
              </>
            )}
          </tr>
        </thead>
        {searchResults && (
          <tbody>
            {searchResults.map((user, index) => {
              return (
                <tr key={index} onClick={() => viewUser(user)} className="cursor-pointer">
                  {role === 'student' && (
                    <>
                      <td>{user.rollNo}</td>
                      <td>{user.name}</td>
                      {ctx.userData.role === 'super-admin' && (
                        <td>{user.batch.admin.department}</td>
                      )}
                      <td>{user.email}</td>
                      <td>
                        {user.confirmed && <CheckIcon />}
                        {!user.confirmed && <CrossIcon />}
                      </td>
                    </>
                  )}
                  {role === 'teacher' && (
                    <>
                      <td>{index + 1}</td>
                      <td>{user.name}</td>
                      {ctx.userData.role === 'super-admin' && (
                        <td>{user.departmentId.department}</td>
                      )}
                      <td>{user.email}</td>
                      <td>{user.gender}</td>
                      <td>{user.designation}</td>

                      <td>
                        {user.confirmed && <CheckIcon />}
                        {!user.confirmed && <CrossIcon />}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        )}
      </Table>
      <div className={!searchResults ? 'h-28' : 'h-14'}></div>
    </>
  );
};

export default SearchResults;
