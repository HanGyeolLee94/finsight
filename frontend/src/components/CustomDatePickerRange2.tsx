import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import { Box, Button, IconButton, Input } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ClearIcon from '@mui/icons-material/Clear';
import { Dayjs } from 'dayjs';
import * as React from 'react';

interface ButtonFieldProps {
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    label?: string;
    id?: string;
    disabled?: boolean;
    InputProps?: { ref?: React.Ref<HTMLButtonElement> };
    inputProps?: { 'aria-label'?: string };
}

function ButtonField(props: ButtonFieldProps) {
    const {
        setOpen,
        label,
        id,
        disabled,
        InputProps: { ref } = {},
        inputProps: { 'aria-label': ariaLabel } = {},
    } = props;

    return (
        <Button
            variant="outlined"
            id={id}
            disabled={disabled}
            ref={ref}
            aria-label={ariaLabel}
            size="small"
            onClick={() => setOpen?.((prev) => !prev)}
            startIcon={<CalendarTodayRoundedIcon fontSize="small" />}
            sx={{ minWidth: 'fit-content' }}
            fullWidth
        >
            {label ? `${label}` : 'Pick a date'}
        </Button>
    );
}

interface CustomDatePickerRangeProps {
    fromDate: Dayjs | null;
    toDate: Dayjs | null;
    onFromChange: (newValue: Dayjs | null) => void;
    onToChange: (newValue: Dayjs | null) => void;
    fromName: string; // FormData에서 사용할 name 속성
    toName: string;   // FormData에서 사용할 name 속성
}

export default function CustomDatePickerRange({
    fromDate,
    toDate,
    onFromChange,
    onToChange,
    fromName,
    toName,
}: CustomDatePickerRangeProps) {
    const [fromOpen, setFromOpen] = React.useState(false);
    const [toOpen, setToOpen] = React.useState(false);

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
                        label={fromDate == null ? null : `From: ${fromDate.format('YYYY/MM/DD')}`}
                        onChange={onFromChange}
                        slots={{ field: ButtonField }}
                        slotProps={{
                            field: { setOpen: setFromOpen } as any,
                            nextIconButton: { size: 'small' },
                            previousIconButton: { size: 'small' },
                        }}
                        open={fromOpen}
                        onClose={() => setFromOpen(false)}
                        onOpen={() => setFromOpen(true)}
                        views={['year', 'month', 'day']}
                    />
                    {fromDate && (
                        <IconButton
                            onClick={handleClearFromDate}
                            size="small"
                        >
                            <ClearIcon fontSize="small" />
                        </IconButton>
                    )}
                    {/* 숨겨진 input 요소 */}
                    <Input
                        type="hidden"
                        name={fromName}
                        value={fromDate ? fromDate.format('YYYY-MM-DD') : ''}
                    />
                </Box>
                <Box flex={1} display="flex" alignItems="center" gap={1}>
                    <DatePicker
                        value={toDate}
                        label={toDate == null ? null : `To: ${toDate.format('YYYY/MM/DD')}`}
                        onChange={onToChange}
                        slots={{ field: ButtonField }}
                        slotProps={{
                            field: { setOpen: setToOpen } as any,
                            nextIconButton: { size: 'small' },
                            previousIconButton: { size: 'small' },
                        }}
                        open={toOpen}
                        onClose={() => setToOpen(false)}
                        onOpen={() => setToOpen(true)}
                        views={['year', 'month', 'day']}
                    />
                    {toDate && (
                        <IconButton
                            onClick={handleClearToDate}
                            size="small"
                        >
                            <ClearIcon fontSize="small" />
                        </IconButton>
                    )}
                    {/* 숨겨진 input 요소 */}
                    <Input
                        type="hidden"
                        name={toName}
                        value={toDate ? toDate.format('YYYY-MM-DD') : ''}
                    />
                </Box>
            </Box>
        </LocalizationProvider>
    );
}
