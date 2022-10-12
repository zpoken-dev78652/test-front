import {
  useSelector as userSelector,
  TypedUseSelectorHook,
  useDispatch,
} from "react-redux";
import { RootState } from "../redux";

export const useRedux = (): [typeof useSelector, typeof dispatch] => {
  const useSelector: TypedUseSelectorHook<RootState> = userSelector;
  const dispatch = useDispatch();

  return [useSelector, dispatch];
};
