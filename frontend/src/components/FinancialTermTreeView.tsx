import * as React from "react";
import clsx from "clsx";
import { animated, useSpring } from "@react-spring/web";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import {
  unstable_useTreeItem2 as useTreeItem2,
  UseTreeItem2Parameters,
} from "@mui/x-tree-view/useTreeItem2";
import {
  TreeItem2Content,
  TreeItem2IconContainer,
  TreeItem2Label,
  TreeItem2Root,
} from "@mui/x-tree-view/TreeItem2";
import { TreeItem2Icon } from "@mui/x-tree-view/TreeItem2Icon";
import { TreeItem2Provider } from "@mui/x-tree-view/TreeItem2Provider";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { FINANCIAL_TERMS_UPDATED } from "@/data/financialTerm";

type Color = "blue" | "green";

export type FinancialTreeItem = {
  color?: Color;
  id: string;
  label: string;
  description?: string;
  example?: string;
  children?: FinancialTreeItem[];
};

function DotIcon({ color }: { color: string }) {
  return (
    <Box sx={{ marginRight: 1, display: "flex", alignItems: "center" }}>
      <svg width={6} height={6}>
        <circle cx={3} cy={3} r={3} fill={color} />
      </svg>
    </Box>
  );
}

const AnimatedCollapse = animated(Collapse);

function TransitionComponent(props: any) {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
    },
  });

  return <AnimatedCollapse style={style} {...props} />;
}

interface CustomLabelProps {
  children: React.ReactNode;
  color?: Color;
  expandable?: boolean;
}

function CustomLabel({
  color,
  expandable,
  children,
  ...other
}: CustomLabelProps) {
  const theme = useTheme();
  const colors = {
    blue: theme.palette.primary.main,
    green: theme.palette.success.main,
  };

  const iconColor = color ? colors[color] : null;
  return (
    <TreeItem2Label {...other} sx={{ display: "flex", alignItems: "center" }}>
      {iconColor && <DotIcon color={iconColor} />}
      <Typography
        className="labelText"
        variant="body2"
        sx={{ color: "text.primary" }}
      >
        {children}
      </Typography>
    </TreeItem2Label>
  );
}

const findItemById = (
  id: string,
  items: FinancialTreeItem[]
): FinancialTreeItem | null => {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findItemById(id, item.children);
      if (found) return found;
    }
  }
  return null;
};

const FinancialTreeItem = React.forwardRef(function FinancialTreeItem(
  props: Omit<UseTreeItem2Parameters, "rootRef"> &
    Omit<React.HTMLAttributes<HTMLLIElement>, "onFocus">,
  ref: React.Ref<HTMLLIElement>
) {
  const { id, itemId, label, disabled, children, ...other } = props;

  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getLabelProps,
    getGroupTransitionProps,
    status,
    publicAPI,
  } = useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref });

  const item = publicAPI.getItem(itemId);
  const color = item?.color;
  return (
    <TreeItem2Provider itemId={itemId}>
      <TreeItem2Root {...getRootProps(other)}>
        <TreeItem2Content
          {...getContentProps({
            className: clsx("content", {
              expanded: status.expanded,
              selected: status.selected,
              focused: status.focused,
              disabled: status.disabled,
            }),
          })}
        >
          {status.expandable && (
            <TreeItem2IconContainer {...getIconContainerProps()}>
              <TreeItem2Icon status={status} />
            </TreeItem2IconContainer>
          )}

          <CustomLabel {...getLabelProps({ color })} />
        </TreeItem2Content>
        {children && (
          <TransitionComponent
            {...getGroupTransitionProps({ className: "groupTransition" })}
          />
        )}
      </TreeItem2Root>
    </TreeItem2Provider>
  );
});

export default function FinancialTermTreeView() {
  const [open, setOpen] = React.useState(false);
  const [popupContent, setPopupContent] = React.useState("");

  const handleItemClick = (event: React.MouseEvent, itemId: string) => {
    const item = findItemById(itemId, FINANCIAL_TERMS_UPDATED);
    if (item && !item.children && item.description) {
      setPopupContent(
        `${item.description}\n\nExample: ${item.example || "N/A"}`
      );
      setOpen(true);
    }
  };

  const { t } = useTranslation();

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        flexGrow: 1,
        height: "300px", // Card의 전체 높이 지정
        overflowY: "hidden", // 스크롤을 내부 트리에만 적용
      }}
    >
      <CardContent sx={{ flexGrow: 1, overflow: "hidden" }}>
        <Typography component="h2" variant="subtitle2">
          {t("geumyongyongo")}
        </Typography>
        <RichTreeView
          items={FINANCIAL_TERMS_UPDATED}
          aria-label="financial-terms"
          multiSelect
          defaultExpandedItems={["1"]}
          defaultSelectedItems={["1.1"]}
          onItemClick={handleItemClick}
          sx={{
            m: "0 -8px",
            pb: "8px",
            height: "100%", // 부모 요소 높이 적용
            maxHeight: "400px", // 최대 높이 지정
            flexGrow: 1,
            overflowY: "auto", // 스크롤 적용
          }}
          slots={{ item: FinancialTreeItem }}
        />
      </CardContent>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{t("seolmyeong")}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" whiteSpace="pre-line">
            {popupContent}
          </Typography>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
