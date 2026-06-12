import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ActionDispatcher } from '@/core/actions/ActionDispatcher';
import { registerActionHandlers } from '@/core/actions/registerActionHandlers';
import { useSubmitFormMutation } from '@/store/api/dataApi';
import type { ActionPayload } from '@sdui/shared';
import type { AppDispatch } from '@/store';

export function useActionHandler() {
  const dispatch = useDispatch<AppDispatch>();
  const [submitForm] = useSubmitFormMutation();

  useEffect(() => {
    registerActionHandlers(dispatch, async (args) => {
      await submitForm(args).unwrap();
    });
  }, [dispatch, submitForm]);

  return useCallback(async (action: ActionPayload) => {
    await ActionDispatcher.dispatch(action);
  }, []);
}
