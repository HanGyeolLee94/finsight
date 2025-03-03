"use client";

import MainLayout from "@/app/[locale]/MainLayout";
import { MenuReloadProvider } from "@/context/MenuReloadProvider";
import { RowDataProvider } from "@/context/RowDataContext";
import { startLoading, stopLoading } from "@/store/loadingSlice";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

// Configurable paths that bypass the main layout
const excludedPaths = ["/login", "/signup"];

const LayoutComponent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname(); // Track current route

  const dispatch = useDispatch();

  useEffect(() => {
    // 경로가 변경될 때 로딩 상태 처리
    dispatch(startLoading());

    // 로딩이 완료되었다고 가정하고 일정 시간 후 로딩 상태를 해제
    const timeout = setTimeout(() => {
      dispatch(stopLoading());
    }, 500); // 1초 후 로딩 상태 해제 (임의 시간)

    return () => {
      clearTimeout(timeout);
    };
  }, [pathname, dispatch]);
  // Bypass layout for excluded paths
  if (excludedPaths.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <RowDataProvider>
      <MenuReloadProvider>
        <MainLayout>{children}</MainLayout>
      </MenuReloadProvider>
    </RowDataProvider>
  );
};

export default LayoutComponent;
