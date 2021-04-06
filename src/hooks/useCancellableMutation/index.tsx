import { CancelToken, CancelTokenSource } from 'axios';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { UseMutationOptions, UseMutationResult } from 'react-query/types/react/types';
import { getCancelToken } from '../../utils/axios';

function useCancellableMutation<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
  mutationFn: (cancelToken: CancelToken, variables?: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> {
  const [source, setSource] = useState<CancelTokenSource>();

  const mutationFunction = function (variables: TVariables) {
    return mutationFn(source.token, variables);
  };

  useEffect(() => {
    setSource(getCancelToken());
  }, [setSource]);

  useEffect(() => {
    return () => {
      source?.cancel('A requisição foi cancelada...');
    };
  }, [source]);

  return useMutation(mutationFunction, options);
}

export default useCancellableMutation;
