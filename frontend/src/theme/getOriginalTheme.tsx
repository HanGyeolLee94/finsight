import { PaletteMode, ThemeOptions } from '@mui/material/styles';
import type { } from '@mui/material/themeCssVarsAugmentation';
import {
  inputsCustomizations,
} from './original-customizations';

export default function getOriginalTheme(mode: PaletteMode): ThemeOptions {
  return {
    palette: {
      mode,  // PaletteMode에 따라 'light' 또는 'dark' 설정
    },
    components: {
      ...inputsCustomizations,  // 기존의 커스터마이징된 컴포넌트 설정 포함
    },
  };
}
