import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import useLockPage from '../../hooks/useLockPage';
import useAuthStore from '../../store/useAuth';

function LockPageManager(): null {
  const history = useHistory()
  const location = useLocation()

  const isLogged = useAuthStore(state => state.isLogged);
  const lockedPage = useLockPage();

  useEffect(() => {
    if (!isLogged)
      return null;

    if (!lockedPage)
      return null;

    const fixedPath = lockedPage.startsWith('/') ? '' : `/${lockedPage}`;

    if (location.pathname === fixedPath)
      return null;

    history.push(fixedPath)
  }, [isLogged, lockedPage, location, history]);

  return null;
}

export default LockPageManager;
