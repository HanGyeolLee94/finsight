import React from 'react';
import { Box, IconButton, Input } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ClearIcon from '@mui/icons-material/Clear';
import { Dayjs } from 'dayjs';

interface CustomDatePickerRangeProps {
    fromDate: Dayjs | null;
    toDate: Dayjs | null;
    onFromChange: (newValue: Dayjs | null) => void;
    onToChange: (newValue: Dayjs | null) => void;
    fromName: string;  // FormData에서 사용할 name 속성
    toName: string;    // FormData에서 사용할 name 속성
}

export default function CustomDatePickerRange({
    fromDate,
    toDate,
    onFromChange,
    onToChange,
    fromName,
    toName,
}: CustomDatePickerRangeProps) {

    const handleClearFromDate = () => {
        onFromChange(null);
    };

    const handleClearToDate = () => {
        onToChange(null);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box display="flex" gap={2} width="100%">
                <Box flex={1} display="flex" alignItems="center" gap={1}>
                    <DatePicker
                        value={fromDate}
                        onChange={onFromChange}
                        views={['year', 'month', 'day']}
                        format="YYYY/MM/DD"
                        sx={{ flex: 1 }}
                    />
                    {fromDate && (
                        <IconButton onClick={handleClearFromDate} size="small">
                            <ClearIcon fontSize="small" />
                        </IconButton>
                    )}
                    {/* 숨겨진 input 요소 - FormData에서 사용할 fromName */}
                    <input
                        type="hidden"
                        name={fromName}
                        value={fromDate ? fromDate.format('YYYY-MM-DD') : ''}
                    />
                </Box>

                <Box flex={1} display="flex" alignItems="center" gap={1}>
                    <DatePicker
                        value={toDate}
                        onChange={onToChange}
                        views={['year', 'month', 'day']}
                        format="YYYY/MM/DD"
                        sx={{ flex: 1 }}  // DatePicker 높이 설정
                    />
                    {toDate && (
                        <IconButton onClick={handleClearToDate} size="small">
                            <ClearIcon fontSize="small" />
                        </IconButton>
                    )}
                    {/* 숨겨진 input 요소 - FormData에서 사용할 toName */}
                    <input
                        type="hidden"
                        name={toName}
                        value={toDate ? toDate.format('YYYY-MM-DD') : ''}
                    />
                </Box>
            </Box>
        </LocalizationProvider>
    );
}
