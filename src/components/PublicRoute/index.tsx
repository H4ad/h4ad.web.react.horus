import { ReactElement } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { environment } from '../../environments/environment';
import useAuthStore from '../../store/useAuth';

function PublicRoute({ children, ...props }: RouteProps): ReactElement {
  const isLogged = useAuthStore((state) => state.isLogged);

  if (!isLogged) return <Route {...props}>{children}</Route>;

  return (
    <Route
      {...props}
      render={({ location }) => {
        return (
          <Redirect
            to={{
              pathname: environment.defaultProtectedRoute,
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
}

export default PublicRoute;
