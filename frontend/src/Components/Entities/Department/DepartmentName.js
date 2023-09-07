import React, { useContext } from 'react';
import AppContext from '../../Context/AppContext';

const DepartmentName = ({ name, className }) => {
  const ctx = useContext(AppContext);
  const departmentName = name || ctx.userData.department;

  return (
    <div
      className={`text-center text-xl md:text-2xl font-bold text-primary mb-2 select-none ${className}`}>
      Department of {departmentName}
    </div>
  );
};

export default DepartmentName;
