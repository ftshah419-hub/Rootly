import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { renderUserRoutes } from './userRoutes';
import '../../styles/user/userStyles.css';

const UserApp = () => {
  return (
    <Routes>
      {renderUserRoutes()}
    </Routes>
  );
};

export default UserApp;
