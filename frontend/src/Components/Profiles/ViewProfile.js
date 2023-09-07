import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Menu, { MenuItem, MenuItems } from '../Utils/Menu';

const ViewProfile = () => {
  useEffect(() => {});

  return (
    <>
      <Menu>
        <MenuItems>
          <MenuItem text="Profile" tab="view" />
          <MenuItem text="Edit Profile" tab="edit-profile" />
          <MenuItem text="Update Profile Pic " tab="edit-photo" />
          <MenuItem text="Update Password" tab="update-password" />
        </MenuItems>
      </Menu>
      <Outlet />
    </>
  );
};

export default ViewProfile;
