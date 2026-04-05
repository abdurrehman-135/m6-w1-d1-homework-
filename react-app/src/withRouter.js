import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    const history = {
      push: (path) => navigate(path),
      replace: (path) => navigate(path, { replace: true })
    };

    const match = { params };

    return (
      <Component
        {...props}
        history={history}
        location={location}
        match={match}
      />
    );
  }

  return ComponentWithRouterProp;
}
