import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMeQuery } from '@/store/api/authApi';
import { useGetRuntimeConfigQuery } from '@/store/api/configApi';
import { setPermissions } from '@/store/slices/permissionsSlice';
import { setFeatureFlags } from '@/store/slices/featureFlagsSlice';
import { setThemeConfig } from '@/store/slices/themeSlice';
import { setProfile, clearCredentials } from '@/store/slices/userSlice';
import type { RootState } from '@/store';

export function useAppBootstrap() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  const { data: me, error: meError } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  const { data: runtime } = useGetRuntimeConfigQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (me) {
      dispatch(setProfile(me));
    }
  }, [me, dispatch]);

  useEffect(() => {
    if (meError && 'status' in meError && meError.status === 401) {
      dispatch(clearCredentials());
    }
  }, [meError, dispatch]);

  useEffect(() => {
    if (runtime) {
      dispatch(setPermissions(runtime.permissions));
      dispatch(setFeatureFlags(runtime.featureFlags));
      dispatch(
        setThemeConfig({
          primaryColor: runtime.theme.primaryColor,
          brandName: runtime.theme.brand.name,
          brandLogo: runtime.theme.brand.logo,
        }),
      );
    }
  }, [runtime, dispatch]);

  return { isAuthenticated, isReady: isAuthenticated && !!runtime };
}
