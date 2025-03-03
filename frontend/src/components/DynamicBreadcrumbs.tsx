import React, { useEffect, useState, ReactNode } from "react";
import { Breadcrumbs, Link, Typography, Box } from "@mui/material";
import { usePathname } from "next/navigation";

interface MenuItem {
  MENU_ID: string;
  MENU_NAME: string;
  PATH?: string;
  subRows?: MenuItem[];
}

interface DynamicBreadcrumbsProps {
  children?: ReactNode; // 추가 요소
}

export default function DynamicBreadcrumbs({
  children,
}: DynamicBreadcrumbsProps) {
  const pathname = usePathname();
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [breadcrumbItems, setBreadcrumbItems] = useState<MenuItem[]>([]);
  const [dynamicSegment, setDynamicSegment] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedMenu = localStorage.getItem("menuData");
      if (storedMenu) {
        setMenuData(JSON.parse(storedMenu));
      }
    }
  }, []);

  useEffect(() => {
    if (menuData.length > 0 && pathname) {
      const pathSegments = pathname.split("/").filter(Boolean);

      // 현재 경로가 menuData에 존재하는지 확인 (최상위 및 subRows 포함)
      const currentMenuExists = findMenuByPath(pathname, menuData);

      // basePath 설정: menuData에 있으면 pathname, 없으면 상위 경로
      const basePath = currentMenuExists
        ? pathname
        : `/${pathSegments.slice(0, pathSegments.length - 1).join("/")}`;

      // 상세 페이지 여부 확인
      const isDetailPage = !currentMenuExists && pathSegments.length > 1;

      // dynamicSegment 설정
      const dynamicSegmentValue = isDetailPage
        ? pathSegments[pathSegments.length - 1]
        : null;
      setDynamicSegment(dynamicSegmentValue);

      // Breadcrumb 생성
      const breadcrumbs = findBreadcrumbs(basePath, menuData);
      setBreadcrumbItems(breadcrumbs);
    }
  }, [pathname, menuData]);

  // 재귀적으로 menuData에서 PATH를 찾는 함수
  const findMenuByPath = (path: string, menus: MenuItem[]): boolean => {
    for (const menu of menus) {
      if (menu.PATH === path) {
        return true;
      }
      if (menu.subRows) {
        if (findMenuByPath(path, menu.subRows)) {
          return true;
        }
      }
    }
    return false;
  };

  const findBreadcrumbs = (
    path: string,
    menus: MenuItem[],
    breadcrumbs: MenuItem[] = []
  ): MenuItem[] => {
    for (const menu of menus) {
      if (menu.PATH === path) {
        return [...breadcrumbs, menu];
      }
      if (menu.subRows) {
        const subBreadcrumbs = findBreadcrumbs(path, menu.subRows, [
          ...breadcrumbs,
          menu,
        ]);
        if (subBreadcrumbs.length > 0) {
          return subBreadcrumbs;
        }
      }
    }
    return [];
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Breadcrumbs aria-label="breadcrumb">
        {breadcrumbItems.map((item, index) => {
          const isLast =
            index === breadcrumbItems.length - 1 && !dynamicSegment;

          return isLast ? (
            <Typography
              key={item.MENU_ID}
              variant="body1"
              sx={{ color: "text.primary", fontWeight: 600 }}
            >
              {item.MENU_NAME}
            </Typography>
          ) : (
            <Link
              key={item.MENU_ID}
              underline="hover"
              color="inherit"
              href={item.PATH}
              sx={{
                pointerEvents: item.PATH ? "auto" : "none", // PATH 없으면 클릭 차단
                cursor: item.PATH ? "pointer" : "default", // 클릭 가능한 경우만 포인터 표시
              }}
            >
              {item.MENU_NAME}
            </Link>
          );
        })}

        {/* 마지막 동적 세그먼트는 클릭 불가능 */}
        {dynamicSegment && (
          <Typography variant="body1" sx={{ color: "text.primary" }}>
            {dynamicSegment}
          </Typography>
        )}
      </Breadcrumbs>

      {/* 추가 요소 */}
      {children && <Box>{children}</Box>}
    </Box>
  );
}
