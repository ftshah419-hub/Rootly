import React from 'react';
import { Route } from 'react-router-dom';

import HomePage from './HomePage';
import ExplorePage from './ExplorePage';
import MapDiscoveryPage from './MapDiscoveryPage';
import ProductDetailPage from './ProductDetailPage';
import CreateListingPage from './CreateListingPage';
import EditListingPage from './EditListingPage';
import BuySellWorkspacePage from './BuySellWorkspacePage';
import BarterExchangePage from './BarterExchangePage';
import HarvestPlannerPage from './HarvestPlannerPage';
import PrebookingPage from './PrebookingPage';
import UserDashboardPage from './UserDashboardPage';
import MessagesPage from './MessagesPage';
import NotificationsPage from './NotificationsPage';
import ProfilePage from './ProfilePage';
import HarvestAIStudioPage from './HarvestAIStudioPage';

export const userRoutesConfig = [
  { path: '/', element: <HomePage /> },
  { path: '/explore', element: <ExplorePage /> },
  { path: '/map', element: <MapDiscoveryPage /> },
  { path: '/products/:id', element: <ProductDetailPage /> },
  { path: '/create-listing', element: <CreateListingPage /> },
  { path: '/edit-listing/:id', element: <EditListingPage /> },
  { path: '/buy-sell', element: <BuySellWorkspacePage /> },
  { path: '/workspace', element: <BuySellWorkspacePage /> },
  { path: '/barter', element: <BarterExchangePage /> },
  { path: '/harvest-planner', element: <HarvestPlannerPage /> },
  { path: '/harvest', element: <HarvestPlannerPage /> },
  { path: '/prebooking', element: <PrebookingPage /> },
  { path: '/dashboard', element: <UserDashboardPage /> },
  { path: '/messages', element: <MessagesPage /> },
  { path: '/notifications', element: <NotificationsPage /> },
  { path: '/profile', element: <ProfilePage /> },
  { path: '/harvest-ai', element: <HarvestAIStudioPage /> },
  { path: '/ai-studio', element: <HarvestAIStudioPage /> },
];

export const renderUserRoutes = () => {
  return userRoutesConfig.map((route) => (
    <Route key={route.path} path={route.path} element={route.element} />
  ));
};

export default userRoutesConfig;
