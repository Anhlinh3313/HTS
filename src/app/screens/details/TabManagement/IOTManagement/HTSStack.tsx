import HTS, { initSPConfig } from "@eohjsc/react-native-hts";
import React, { memo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/reducers";
export const HTSStack = memo(() => {
  const auth = useSelector((state: RootState) => state.eoh);
  return <HTS langTranslate={{}} auth={auth} />;
});
