import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import React, { useState } from 'react';

interface RadioOption {
    id: string;
    text: string;
}

interface CustomRadioGroupProps {
    options: RadioOption[];
    defaultValue?: string;
    name: string; // FormData에서 사용할 name 속성
}

const CustomRadioGroup = ({ options, defaultValue = '', name }: CustomRadioGroupProps) => {
    const [selected, setSelected] = useState<string>(defaultValue);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelected(event.target.value);
    };

    return (
        <FormControl component="fieldset">
            <RadioGroup
                aria-labelledby="custom-radio-buttons-group-label"
                name={name} // FormData에서 사용할 name 설정
                value={selected}
                onChange={handleChange}
                row  // 여기에 row 속성을 추가하여 가로 배치
            >
                {options.map((option) => (
                    <FormControlLabel
                        key={option.id}
                        value={option.id}
                        control={<Radio />}
                        label={option.text}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );
};

export default CustomRadioGroup;
