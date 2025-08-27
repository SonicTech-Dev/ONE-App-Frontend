import { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { getColors } from '../config/colors';

const useColors = () => {
  const { primary, secondary, tertiary, background } = useContext(StoreContext);
  return getColors({ primary, secondary, tertiary, background });
};

export default useColors;
