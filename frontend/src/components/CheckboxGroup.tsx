import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { useState } from 'react';

interface CheckboxOption {
    id: string;
    text: string;
}

interface CheckboxGroupProps {
    options: CheckboxOption[];
    selectedOptions?: string[]; // Optional initial selected options
    name: string; // FormData에서 사용할 name 속성
}

const CheckboxGroup = ({ options, selectedOptions = [], name }: CheckboxGroupProps) => {
    const [selected, setSelected] = useState<string[]>(selectedOptions);

    const handleChange = (id: string) => {
        const updatedSelected = selected.includes(id)
            ? selected.filter((item) => item !== id)
            : [...selected, id];

        setSelected(updatedSelected);
    };

    return (
        <FormGroup row>
            {options.map((option) => (
                <FormControlLabel
                    key={option.id}
                    control={
                        <Checkbox
                            name={name} // 모든 체크박스에 동일한 name 적용
                            value={option.id} // 각 체크박스의 value로 id 사용
                            checked={selected.includes(option.id)}
                            onChange={() => handleChange(option.id)}
                        />
                    }
                    label={option.text}
                />
            ))}
        </FormGroup>
    );
};

export default CheckboxGroup;
