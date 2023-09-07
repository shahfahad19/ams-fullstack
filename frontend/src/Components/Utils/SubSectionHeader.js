import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../Context/AppContext';

const SubSectionHeader = (props) => {
  const ctx = useContext(AppContext);

  return (
    <>
      <div className="flex items-center justify-between bg-backgroundSecondary p-2 select-none">
        <div className="flex-grow text-center text-lg font-medium">{props.text}</div>
        {ctx.userData.role !== 'student' && props.showBtn && (
          <Link to={props.btnLink} className="btn btn-primary btn-sm mr-1">
            {props.btnText}
          </Link>
        )}
      </div>
    </>
  );
};

export default SubSectionHeader;
