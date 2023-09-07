import React, { useRef, useState } from 'react';
import Form, {
  FormControl,
  FormField,
  FormGroup,
  FormLabel,
  FormLabelAlt,
  FormSubmitBtn,
  FormTitle,
  FormWrapper
} from '../Utils/Form';
import { useContext } from 'react';
import AppContext from '../Context/AppContext';

const SearchForm = ({ setSearchData }) => {
  const ctx = useContext(AppContext);
  const [btnState, setBtnState] = useState('');

  const [user, setUser] = useState('student');
  const [searchBy, setSearchBy] = useState('name');
  const [queryType, setQueryType] = useState('text');

  const [queryError, setQueryError] = useState('');

  const searchQuery = useRef();

  const userChangeHandler = (event) => setUser(event.target.value);

  const searchByChangeHandler = (event) => {
    const search_by = event.target.value;
    setSearchBy(search_by);
    if (search_by === 'name') setQueryType('text');
    else if (search_by === 'rollNo') setQueryType('number');
    else if (search_by === 'email') setQueryType('email');
    setBtnState('');
  };

  const submitForm = (event) => {
    event.preventDefault();
    const query = searchQuery.current.value;
    if (!query || query === '') {
      setQueryError('Required');
    } else {
      setQueryError('');
      setSearchData({
        user,
        searchBy,
        query
      });
    }
  };

  return (
    <div className="p-2">
      <FormWrapper>
        <Form onSubmit={submitForm}>
          <FormTitle>Search</FormTitle>
          <FormGroup>
            <FormField>
              <FormLabel>Search</FormLabel>
              <FormControl>
                <select className={ctx.inputClasses} onChange={userChangeHandler}>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </FormControl>
            </FormField>
            <FormField>
              <FormLabel>Search by</FormLabel>
              <FormControl>
                <select className={ctx.inputClasses} onChange={searchByChangeHandler}>
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  {user === 'student' && <option value="rollNo">Roll No</option>}
                </select>
              </FormControl>
            </FormField>
            <FormField>
              <FormLabel>Search Query</FormLabel>
              <FormControl>
                <input
                  className={`${ctx.inputClasses}${queryError === '' ? '' : ' input-error'}`}
                  type={queryType}
                  ref={searchQuery}
                  placeholder={
                    'Enter ' + searchBy[0].toUpperCase() + '' + searchBy.slice(1)
                  }></input>
              </FormControl>
              {queryError !== '' && <FormLabelAlt>{queryError}</FormLabelAlt>}
            </FormField>
            <FormSubmitBtn className={btnState}>Search</FormSubmitBtn>
          </FormGroup>
        </Form>
      </FormWrapper>
    </div>
  );
};

export default SearchForm;
