import { useDispatch } from 'react-redux';
import { TToastConfig, setToastConfig, initToastConfig } from '@store/toast';

type TUseToast = {
  showToast: (config: TToastConfig) => void;
  hideToast: () => void;
};

/**
 *
 * @example
 * const {showToast} = useToast();
 *
 * const onClick = () => {
 *   showToast({message: 'hello world!'});
 * }
 */

export const useToast = (): TUseToast => {
  const dispatch = useDispatch();

  /**
   * 토스트를 띄우는 `action`을 `dispatch`하는 함수.
   * @param config duration의 단위는 ms, 기본값 `3000` message는 children으로
   */

  const showToast = (config: TToastConfig): void => {
    dispatch(setToastConfig(config));
  };

  const hideToast = (): void => {
    dispatch(initToastConfig());
  };

  return { showToast, hideToast };
};
