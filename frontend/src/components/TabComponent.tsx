import React, { useState } from "react";
import { TabList } from "@mui/lab";
import CakeIcon from "@mui/icons-material/Cake";
import CelebrationIcon from "@mui/icons-material/Celebration";
import ParkIcon from "@mui/icons-material/Park";
import CustomTabPanelCard from "@/components/tab/CustomTabPanelCard";
import TabContainer from "@/components/TabContainer";
import TabHeader from "@/components/TabHeader";
import { Tab } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function TabComponent() {
  const { t } = useTranslation();
  const [value, setValue] = useState("1");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <TabContainer value={value}>
      <TabHeader>
        <TabList onChange={handleChange} aria-label="lab API tabs example">
          <Tab
            icon={<CakeIcon />}
            iconPosition="start"
            label={t("chateu")}
            value="1"
          />
          <Tab
            icon={<CelebrationIcon />}
            iconPosition="start"
            label="PARTY"
            value="2"
          />
          <Tab
            icon={<ParkIcon />}
            iconPosition="start"
            label="PARK"
            value="3"
          />
        </TabList>
      </TabHeader>

      <CustomTabPanelCard
        title="Cakes Category"
        description="Delicious cakes for your enjoyment."
        value="1"
        selectedValue={value}
      />
      <CustomTabPanelCard
        title="Party Category"
        description="Party essentials and decorations."
        value="2"
        selectedValue={value}
      />
      <CustomTabPanelCard
        title="Park Category"
        description="Find a great park for your outing."
        value="3"
        selectedValue={value}
      />
    </TabContainer>
  );
}
