import { apiRequest, apiRequestWithLoading } from "@/utils/api"; // Importing apiRequest
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CustomAutoCompleteCombo from "./CustomAutoCompleteCombo";

export default function DefaultPageSelector({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [storedMenuOptions, setStoredMenuOptions] = useState<
    { ID: string; TEXT: string }[]
  >([]);
  const [defaultPage, setDefaultPage] = useState<string>(""); // State to store the default page
  const [email, setEmail] = useState<string | null>(null); // State to store the username
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    // Retrieve username from localStorage
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("email");
      setEmail(email);
    }

    // Fetch stored menu data from localStorage
    if (typeof window !== "undefined") {
      const storedMenu = localStorage.getItem("menuData");

      if (storedMenu) {
        try {
          const parsedMenuData: any[] = JSON.parse(storedMenu);
          const formattedMenu = createStoredMenu(parsedMenuData);
          setStoredMenuOptions(formattedMenu);
        } catch (error) {
          console.error("Failed to parse menuData from localStorage:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    const fetchDefaultPage = async () => {
      if (!email) {
        return;
      }

      try {
        const result = await apiRequestWithLoading(
          "/user-info/get-default-page",
          {
            method: "POST",
            json: { EMAIL: email }, // Send EMAIL as part of the request
          }
        );
        setDefaultPage(result.defaultPage || "home"); // Set defaultPage to the fetched value
      } catch (error) {
        console.error("Failed to fetch default page:", error);
      }
    };

    if (open) {
      fetchDefaultPage();
    }
  }, [email, open]); // Trigger fetchDefaultPage whenever open changes to true and username is available

  const handleSave = async () => {
    try {
      // Update the user's default page
      const result = await apiRequestWithLoading(
        "/user-info/set-default-page",
        {
          method: "POST",
          json: { EMAIL: email, DEFAULT_PAGE: defaultPage }, // Send EMAIL and DEFAULT_PAGE in the request
        }
      );

      if (result.code === "200") {
        const defaultPagePath = result.defaultPagePath; // Assuming defaultPagePath is returned in the response

        // Close the dialog
        onClose();

        // Redirect to the new default page path
        if (defaultPagePath) {
          router.push(defaultPagePath);
        } else {
          console.error("defaultPagePath not found in the response");
        }
      } else {
        console.error("Failed to update default page");
      }
    } catch (error) {
      console.error("Error updating default page:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t("gibonpeijiseontaeg")}</DialogTitle>
      <DialogContent>
        <CustomAutoCompleteCombo
          id="TYPE"
          name="TYPE"
          options={storedMenuOptions}
          defaultValue={defaultPage}
          disableClearable={true}
          onChange={(newValue) => {
            setDefaultPage(newValue ? newValue.ID : ""); // Update defaultPage with the selected option's ID
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("chwisoh")}</Button>
        <Button onClick={handleSave} color="primary">
          {t("jeojang")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Helper function to create storedMenu
function createStoredMenu(data: any[]): { ID: string; TEXT: string }[] {
  const result: { ID: string; TEXT: string }[] = [];

  // Recursive function to handle nested subRows
  function processItems(items: any[]) {
    items.forEach((item) => {
      if (item.PATH) {
        result.push({
          ID: item.MENU_ID,
          TEXT: item.FULL_MENU_NAME,
        });
      }
      if (item.subRows) {
        processItems(item.subRows);
      }
    });
  }

  processItems(data);
  return result;
}
