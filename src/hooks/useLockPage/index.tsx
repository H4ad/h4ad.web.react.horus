import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getQueryParamsHashTable } from './functions';

function useLockPage(): string | null {
  const location = useLocation()

  const [lockedPage, setLockedPage] = useState(null);

  const { lockPage } = useMemo(() => getQueryParamsHashTable(location.search), [location.search]);

  useEffect(() => {
    if (!lockPage)
      return;

    setLockedPage(lockPage)
  }, [lockPage, setLockedPage]);

  return lockedPage;
}

export default useLockPage;
