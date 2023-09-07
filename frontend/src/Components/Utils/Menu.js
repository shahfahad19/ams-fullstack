import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Menu = (props) => {
  return <div className="flex justify-center mb-2 rounded-none">{props.children}</div>;
};

export const MenuItems = (props) => {
  return <div className="tabs tabs-boxed">{props.children}</div>;
};

export const MenuItem = (props) => {
  const navigate = useNavigate();

  const check = (event) => {
    event.preventDefault();
    navigate(props.tab, { replace: true });
  };
  return (
    <NavLink
      onClick={check}
      to={props.tab}
      className={({ isActive }) => (isActive ? 'tab tab-active text-primary' : 'tab')}>
      {props.text}
    </NavLink>
  );
};

export default Menu;
