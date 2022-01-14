import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { setLoginUrl } from '../store/authSlice';

export default function requireAuth(acceptableRoles) {
  return function (ComposedComponent) {
    function Authentication(props) {
      const history = useHistory();
      const dispatch = useDispatch();
      const user = useSelector(state => state.auth.user);

      useEffect(() => {
        if (!user) {
          dispatch(setLoginUrl(history.location.pathname));
          history.push('/login');
          return null;
        }
  
        // if doesn't have roles
        let hasPermission = false;
        if (acceptableRoles.length === 0) {
          hasPermission = true;
        } else {
          acceptableRoles.forEach(role => {
            if (user.role.indexOf(role) !== -1) {
              hasPermission = true;
            }
          });
        }
  
        if (!hasPermission) {
          history.push('/');
          return null;
        }
      }, []);

      return <ComposedComponent {...props} />;
    }

    return Authentication;
  }
}