import * as React from "react";
import { alpha, Theme, Components } from "@mui/material/styles";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { svgIconClasses } from "@mui/material/SvgIcon";
import { toggleButtonGroupClasses } from "@mui/material/ToggleButtonGroup";
import { toggleButtonClasses } from "@mui/material/ToggleButton";
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { gray, brand } from "../themePrimitives";

/* eslint-disable import/prefer-default-export */
export const inputsCustomizations: Components<Theme> = {
  MuiOutlinedInput: {
    styleOverrides: {
      root: {},
      input: {
        padding: "10px 14px !important", // 모든 MuiInputBase-input에 동일한 패딩 적용
      },
    },
  },
  MuiAutocomplete: {
    styleOverrides: {
      inputRoot: {
        padding: "0px",
      },
    },
  },
};
