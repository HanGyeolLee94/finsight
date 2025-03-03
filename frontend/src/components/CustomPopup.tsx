import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText } from '@mui/material';

interface CustomPopupProps {
    open: boolean;
    onClose: () => void;
    onSelect: (value: string) => void;
    options: string[];
}

const CustomPopup: React.FC<CustomPopupProps> = ({ open, onClose, onSelect, options }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Select a Value</DialogTitle>
            <DialogContent>
                <List>
                    {options.map((option) => (
                        <ListItem component="button" onClick={() => onSelect(option)} key={option}>
                            <ListItemText primary={option} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CustomPopup;
