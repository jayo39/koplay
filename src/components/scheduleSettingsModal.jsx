import React, { useState, useEffect } from 'react';
import { Box, Typography, Dialog, DialogTitle, DialogContent, TextField, Button, MenuItem, Select, Divider } from '@mui/material';

const ScheduleSettingsModal = ({ open, onClose, onSave, onDelete, initialData }) => {
    const [name, setName] = useState(initialData?.name || "");
    const [privacy, setPrivacy] = useState(initialData?.privacy || "me");
    const [isDefault, setIsDefault] = useState(!!initialData?.is_default);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setPrivacy(initialData.privacy);
            setIsDefault(!!initialData.is_default);
        }
    }, [initialData]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" disableScrollLock>
            <DialogTitle sx={{ fontWeight: 'bold' }}>시간표 설정</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
                    <TextField 
                        label="시간표 이름" 
                        fullWidth 
                        variant="filled" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />
                    
                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#888' }}>공개 범위</Typography>
                        <Select value={privacy} onChange={(e) => setPrivacy(e.target.value)} fullWidth variant="filled" sx={{ mt: 0.5 }}>
                            <MenuItem value="me">나만 보기</MenuItem>
                            <MenuItem value="friends">친구에게 공개</MenuItem>
                        </Select>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => setIsDefault(!isDefault)}>
                        <input type="checkbox" checked={isDefault} readOnly style={{ cursor: 'pointer' }} />
                        <Typography sx={{ fontSize: '14px' }}>기본 시간표로 설정</Typography>
                    </Box>

                    <Button 
                        variant="contained" 
                        sx={{ bgcolor: '#f91f15', '&:hover': { bgcolor: '#d31911' }, fontWeight: 'bold' }} 
                        onClick={() => onSave(name, privacy, isDefault)}
                        disableElevation
                    >
                        저장하기
                    </Button>

                    <Divider />

                    <Button 
                        color="error"
                        style={{ fontSize: '12px', fontWeight: 'bold', textDecoration: 'underline' }}
                        onClick={onDelete}
                    >
                        이 시간표 삭제하기
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ScheduleSettingsModal;