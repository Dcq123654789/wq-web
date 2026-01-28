import { useModel as useUmiModel } from '@umijs/max';

export const useModel = (name: string) => {
  return useUmiModel(name);
};

export default useModel;
