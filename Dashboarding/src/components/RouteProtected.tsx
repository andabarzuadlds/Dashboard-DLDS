import React from 'react';
import { Route, RouteProps, useLocation, Redirect } from 'react-router-dom';

interface ProtectedRouteProps extends Omit<RouteProps, 'element'> {
  element: React.ReactNode;
}

const RouteProtected: React.FC<ProtectedRouteProps> = ({ element, ...rest }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Redirect to={{ pathname: '/login', state: { from: location } }} />;
  }

  return <Route {...rest} render={() => element} />;
};

export default RouteProtected;
