import { usePermissions } from "@/context/PermissionsContext";
import { apiRequestWithLoading } from "./api";
import buildTree from "./TreeBuilder";

export const useFetchAndStoreMenu = () => {
  const { setPermissions } = usePermissions();

  return async () => {
    try {
      const email = localStorage.getItem("email");

      if (!email) {
        throw new Error("Email is not found in localStorage");
      }

      const menu = await apiRequestWithLoading(
        "/api/auth/get-menu-permissions",
        {
          method: "POST",
          json: { EMAIL: email },
        }
      );

      const permissions = menu.map((item: any) => ({
        PATH: item.PATH || null,
        MENU_ID: item.MENU_ID,
        CAN_EDIT: item.CAN_EDIT,
      }));

      localStorage.setItem("permissions", JSON.stringify(permissions));
      setPermissions(permissions);

      const options = {
        parentKey: "P_MENU_ID",
        childKey: "MENU_ID",
        fullPathColumns: [{ from: "MENU_NAME", to: "FULL_MENU_NAME" }],
      };

      const mainListItems = buildTree(menu, options);
      localStorage.setItem("menuData", JSON.stringify(mainListItems));
    } catch (error) {
      console.error("Error fetching or processing the menu:", error);
      throw new Error("Error fetching or processing the menu");
    }
  };
};

export const getStoredPermissions = (): {
  PATH?: string;
  MENU_ID: string;
  CAN_EDIT: string;
}[] => {
  const storedPermissions = localStorage.getItem("permissions");
  return storedPermissions ? JSON.parse(storedPermissions) : [];
};
