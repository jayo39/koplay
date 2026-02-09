import React, { useState } from 'react';
import { Box, Typography, Dialog, DialogTitle, DialogContent, TextField, Button, MenuItem, Select, Divider } from '@mui/material';

const CreateScheduleModal = ({ open, onClose, onSave }) => {
    const [name, setName] = useState("");
    const [privacy, setPrivacy] = useState("me");

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" disableScrollLock>
            <DialogTitle sx={{ fontWeight: 'bold' }}>새 시간표 만들기</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField label="시간표 이름" fullWidth variant="filled" value={name} onChange={(e) => setName(e.target.value)} />
                    <Select value={privacy} onChange={(e) => setPrivacy(e.target.value)} fullWidth variant="filled">
                        <MenuItem value="me">나만 보기</MenuItem>
                        <MenuItem value="friends">친구에게 공개</MenuItem>
                    </Select>
                    <Button variant="contained" sx={{ bgcolor: '#f91f15', '&:hover': { bgcolor: '#d31911' } }} onClick={() => onSave(name, privacy)} disableElevation>
                        생성하기
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default CreateScheduleModal