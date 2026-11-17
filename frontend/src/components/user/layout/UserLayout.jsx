import React from 'react';
import UserNavbar from './UserNavbar.jsx';
import UserFooter from './UserFooter.jsx';
import UserMobileNav from './UserMobileNav.jsx';

export const UserLayout = ({ children, onOpenSearch }) => {
  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-darkbg text-bark dark:text-cream transition-colors duration-300">
      <UserNavbar onOpenSearch={onOpenSearch} />
      <main className="flex-1 w-full pt-20 pb-16 xl:pb-0">{children}</main>
      <UserFooter />
      <UserMobileNav />
    </div>
  );
};

export default UserLayout;
