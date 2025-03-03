"use client"; // 클라이언트 컴포넌트로 선언

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/store"; // Named import for `store`

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
