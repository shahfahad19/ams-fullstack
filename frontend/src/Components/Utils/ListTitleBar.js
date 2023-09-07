import React from 'react';
import { Link } from 'react-router-dom';

const ListTitleBar = (props) => {
  return <div className="flex justify-between items-center p-2">{props.children}</div>;
};

export const ListTitle = (props) => {
  return <h1 className="font-medium text-center text-xl">{props.text}</h1>;
};

export const ListTitleButton = (props) => {
  return (
    <div>
      <Link
        className="btn btn-solid-primary rounded-full font-normal normal-case btn-xs sm:btn-sm"
        to={props.to}>
        Add
      </Link>
    </div>
  );
};

export default ListTitleBar;
