import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, Button, Box, MenuItem, Select, Typography, TextField } from '@mui/material';
import { DayButton } from "../styles/components/dayButton.styles";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from '../api/axios';

const CourseSchema = Yup.object().shape({
    name: Yup.string().required('*과목명은 필수입니다.'),
    location: Yup.string(),
    day: Yup.number().min(0).max(6),
    startHour: Yup.number(),
    startMin: Yup.number(),
    endHour: Yup.number(),
    endMin: Yup.number(),
    color: Yup.string()
});

const PREDEFINED_COLORS = [
    '#ffcfcf', // Red-ish
    '#cdeaff', // Blue-ish
    '#d0f0d0', // Green-ish
    '#ffe5b4', // Orange-ish
    '#e0d4ff', // Purple-ish
    '#caf0f8', // Cyan-ish
    '#fdfd96', // Lemon-ish
    '#e8d3c5', // Sandy-ish
    '#e0e0e0'  // Grey-ish
];

const AddCourseModal = ({ open, onClose, initialData, onSave, scheduleId, isEditMode }) => {

    const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
    const MINUTES = [0, 10, 20, 30, 40, 50];
    const locationRef = useRef(null);

    const handleNameKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            locationRef.current?.focus();
        }
    };

    const handleSubmit = async (values, { resetForm }) => {
        const startDecimal = values.startHour + (values.startMin / 60);
        const endDecimal = values.endHour + (values.endMin / 60);

        if (endDecimal <= startDecimal) {
            alert("종료 시간은 시작 시간보다 늦어야 합니다.");
            return;
        }

        const payload = {
            schedule_id: scheduleId,
            name: values.name,
            location: values.location,
            day: values.day,
            start_time: startDecimal,
            end_time: endDecimal,
            color: values.color,
        };

        try {
            if (isEditMode) {
                await axios.put(`/api/schedule/${initialData.id}`, payload);
                onSave({ ...payload, id: initialData.id, modifiedAt: new Date().toISOString() });
            } else {
                const res = await axios.post('/api/schedule/add', payload);
                onSave({ ...payload, id: res.data.id, modifiedAt: new Date().toISOString() });
            }
            resetForm();
            onClose();
        } catch (err) {
            console.error("저장 실패", err);
            alert("일정 저장에 실패했습니다.");
        }
    };

    return (
        <Formik
            initialValues={{
                name: initialData?.name || '',
                location: initialData?.location || '',
                day: initialData?.day ?? 0,
                startHour: Math.floor(initialData?.start || initialData?.time || 8),
                startMin: Math.round(((initialData?.start || 0) % 1) * 60) || 0,
                endHour: Math.floor((initialData?.start + initialData?.duration) || (initialData?.time + 1) || 9),
                endMin: Math.round((((initialData?.start + initialData?.duration) || 0) % 1) * 60) || 0,
                color: initialData?.color || '#fff0f0'
            }}
            enableReinitialize={true}
            validationSchema={CourseSchema}
            onSubmit={handleSubmit}
        >
            {({ values, errors, touched, handleChange, setFieldValue, handleSubmit }) => (
                <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" disableScrollLock>
                    <DialogTitle sx={{ fontWeight: 'bold', fontSize: '18px' }}>
                        {isEditMode ? '기존 수업 수정' : '새 수업 추가'}
                    </DialogTitle>
                    <DialogContent>
                        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                            <TextField 
                                name="name"
                                label="과목명 (필수)" 
                                fullWidth variant="filled" size="small" 
                                value={values.name} 
                                onChange={handleChange}
                                onKeyDown={handleNameKeyDown}
                                error={touched.name && Boolean(errors.name)}
                                helperText={touched.name && errors.name}
                            />
                            <TextField 
                                name="location"
                                label="장소" 
                                fullWidth variant="filled" size="small" 
                                inputRef={locationRef}
                                value={values.location} 
                                onChange={handleChange} 
                            />
                            
                            <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#888' }}>시간/장소</Typography>
                            
                            <Box sx={{ display: 'flex', gap: '2px' }}>
                                {['월', '화', '수', '목', '금', '토', '일'].map((d, i) => (
                                    <DayButton 
                                        type="button"
                                        key={d} 
                                        active={values.day === i} 
                                        onClick={() => setFieldValue('day', i)}
                                    >
                                        {d}
                                    </DayButton>
                                ))}
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Select size="small" value={values.startHour} onChange={(e) => setFieldValue('startHour', e.target.value)}>
                                    {HOURS.map(h => <MenuItem key={h} value={h}>{h >= 12 ? `오후 ${h === 12 ? 12 : h-12}시` : `오전 ${h}시`}</MenuItem>)}
                                </Select>
                                <Select size="small" value={values.startMin} onChange={(e) => setFieldValue('startMin', e.target.value)}>
                                    {MINUTES.map(m => <MenuItem key={m} value={m}>{m}분</MenuItem>)}
                                </Select>
                                
                                <span style={{ margin: '0 4px', color: '#888' }}>~</span>

                                <Select size="small" value={values.endHour} onChange={(e) => setFieldValue('endHour', e.target.value)}>
                                    {HOURS.map(h => <MenuItem key={h} value={h}>{h >= 12 ? `오후 ${h === 12 ? 12 : h-12}시` : `오전 ${h}시`}</MenuItem>)}
                                </Select>
                                <Select size="small" value={values.endMin} onChange={(e) => setFieldValue('endMin', e.target.value)}>
                                    {MINUTES.map(m => <MenuItem key={m} value={m}>{m}분</MenuItem>)}
                                </Select>
                            </Box>

                            <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#888', mt: 1 }}>색상</Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {PREDEFINED_COLORS.map((c) => (
                                    <Box
                                        key={c}
                                        onClick={() => setFieldValue('color', c)}
                                        sx={{
                                            width: 24,
                                            height: 24,
                                            borderRadius: '50%',
                                            backgroundColor: c,
                                            cursor: 'pointer',
                                            border: values.color === c ? '2px solid #555' : '1px solid #ddd',
                                            transition: 'transform 0.1s',
                                            '&:hover': { transform: 'scale(1.1)' }
                                        }}
                                    />
                                ))}
                            </Box>

                            <Button 
                                variant="contained" 
                                fullWidth
                                sx={{ bgcolor: '#f91f15', mt: 1, '&:hover': { bgcolor: '#d31911' }, fontWeight: 'bold' }} 
                                onClick={handleSubmit}
                                disableElevation
                            >
                                저장
                            </Button>
                        </Box>
                    </DialogContent>
                </Dialog>
            )}
        </Formik>
    );
};

export default AddCourseModal;