import React, { useState, useEffect, useContext, useRef } from 'react';
import Header from "../components/header";
import { PageMargin } from "../styles/pages/pageMargin";
import { Box, Typography, Dialog, DialogTitle, DialogContent, TextField, Button, MenuItem, Select, Divider } from '@mui/material';
import Footer from '../components/footer';
import { ScheduleContainer, GridBody, GridHeader, TimeColumn, DayColumn } from '../styles/components/schedule.styles';
import ScheduleActionsBox from '../components/scheduleActionsBox';
import TimeIndicator from '../components/timeIndicator';
import AddCourseModal from '../components/addCourseModal';
import { UserContext } from "../provider/userProvider";
import axios from '../api/axios';
import { useParams, useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import ScheduleSettingsModal from '../components/scheduleSettingsModal';
import CreateScheduleModal from '../components/createScheduleModal';

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];
const TIMES = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];



const SchedulePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState({ day: 0, time: 9 });
    const [editingCourse, setEditingCourse] = useState(null);
    const [courses, setCourses] = useState([]);
    const { user, loading: authLoading } = useContext(UserContext);
    const [isNewScheduleModalOpen, setIsNewScheduleModalOpen] = useState(false);
    const { userId } = useParams();
    const navigate = useNavigate();

    const [schedules, setSchedules] = useState([]);
    const [activeScheduleIdx, setActiveScheduleIdx] = useState(0);

    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    const gridRef = useRef(null);

    const [targetName, setTargetName] = useState("");
    const targetId = userId || user?.id;
    const isMySchedule = !userId || Number(userId) === Number(user?.id);

    const hasNoSchedules = schedules.length === 0;
    const activeScheduleName = hasNoSchedules ? "시간표 없음" : (schedules[activeScheduleIdx]?.name || "시간표");
    const sidebarTitle = isMySchedule ? activeScheduleName : `${activeScheduleName}`;
    const sidebarTitleColor = hasNoSchedules ? "#888" : "#000";

    const fetchScheduleList = async (id) => {
        if (!id || !user) return;
        try {
            const res = await axios.get(`/api/schedule?userId=${id}`);
            const scheduleData = res.data;
            setSchedules(scheduleData);

            if (scheduleData.length > 0) {
                // Find the index of the schedule where is_default is 1
                const defaultIdx = scheduleData.findIndex(s => s.is_default === 1);
                
                // If found, use that index; otherwise, fallback to 0
                const initialIdx = defaultIdx !== -1 ? defaultIdx : 0;
                
                setActiveScheduleIdx(initialIdx);
                fetchItems(scheduleData[initialIdx].id);
            } else {
                setCourses([]);
            }
        } catch (err) {
            console.error("목록 가져오기 실패", err);
        }
    };

    const fetchItems = async (scheduleId) => {
        try {
            const res = await axios.get(`/api/schedule/items/${scheduleId}`);
            const formattedData = res.data.map(item => ({
                id: item.id,
                name: item.name || "수업", 
                location: item.location,
                day: item.day,
                start: parseFloat(item.start_time),
                duration: parseFloat(item.end_time) - parseFloat(item.start_time),
                color: item.color || '#f0faff',
                modifiedAt: item.modified_at
            }));
            setCourses(formattedData);
        } catch (err) {
            console.error("아이템 가져오기 실패", err);
        }
    };

    useEffect(() => {
        if (authLoading) return;
        if (targetId) fetchScheduleList(targetId);

        const fetchTargetUserInfo = async () => {
            if (isMySchedule) {
                setTargetName(user?.name || "내");
                return;
            }
            try {
                const res = await axios.get(`/api/auth/user/${userId}`);
                setTargetName(res.data.name);
            } catch (err) {
                if (err.response?.status === 403 || err.response?.status === 404) navigate('/404');
            }
        };
        fetchTargetUserInfo();
    }, [userId, user?.id, authLoading, isMySchedule]);

    const handleSelectSchedule = (idx) => {
        setActiveScheduleIdx(idx);
        fetchItems(schedules[idx].id);
    };

    const handleCreateNewSchedule = async (name, privacy) => {
        try {
            await axios.post('/api/schedule/create-folder', { name, privacy });
            setIsNewScheduleModalOpen(false);
            fetchScheduleList(targetId);
        } catch (err) {
            alert("시간표 생성에 실패했습니다.");
        }
    };

    const handleColumnClick = (e, dayIndex) => {
        if (schedules.length === 0) return alert("시간표를 먼저 생성해주세요.");
        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const snappedTime = Math.floor(8 + (y / 60)); 
        setEditingCourse(null);
        setSelectedSlot({ day: dayIndex, time: snappedTime });
        setIsModalOpen(true);
    };

    const handleCourseClick = (e, course) => {
        e.stopPropagation();
        if (!isMySchedule) return;
        setEditingCourse(course);
        setIsModalOpen(true);
    };

    const handleDeleteCourse = async (e, courseId) => {
        e.stopPropagation();
        if (window.confirm("이 일정을 삭제하시겠습니까?")) {
            try {
                await axios.delete(`/api/schedule/${courseId}`);
                setCourses(courses.filter(course => course.id !== courseId));
            } catch (err) {
                alert("삭제에 실패했습니다.");
            }
        }
    };

    const handleSaveCourse = (newCourse) => {
        const formatted = {
            ...newCourse,
            modifiedAt: newCourse.modified_at || new Date().toISOString(),
            start: newCourse.start_time,
            duration: newCourse.end_time - newCourse.start_time
        };

        if (editingCourse) {
            setCourses(prev => prev.map(c => c.id === formatted.id ? formatted : c));
        } else {
            setCourses(prev => [...prev, formatted]);
        }
    };

    const handleUpdateSchedule = async (name, privacy, isDefault) => {
        const activeId = schedules[activeScheduleIdx]?.id;
        try {
            await axios.put(`/api/schedule/folder/${activeId}`, {
                name, privacy, is_default: isDefault
            });
            setIsSettingsModalOpen(false);
            fetchScheduleList(targetId);
        } catch (err) {
            alert("설정 변경에 실패했습니다.");
        }
    };

    const handleDeleteFolder = async () => {
        const activeId = schedules[activeScheduleIdx]?.id;
        if (!activeId) return;

        if (window.confirm("정말 이 시간표를 삭제하시겠습니까? 포함된 모든 일정이 영구적으로 삭제됩니다.")) {
            try {
                await axios.delete(`/api/schedule/folder/${activeId}`);
                setIsSettingsModalOpen(false);
                
                // Important: Reset index to 0 before fetching new list to avoid out-of-bounds errors
                setActiveScheduleIdx(0); 
                fetchScheduleList(targetId);
            } catch (err) {
                alert("삭제에 실패했습니다.");
            }
        }
    };

    return (
        <>
            <Header />
            <PageMargin>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Box sx={{ 
                        display: 'flex', 
                        gap: '40px', 
                        alignItems: 'flex-start',
                        width: '100%'
                    }}>
                        <Box sx={{ 
                            display: 'flex', 
                            gap: { xs: '10px', sm: '40px' }, 
                            alignItems: 'flex-start',
                            width: '100%',
                            maxWidth: '1100px', 
                            mx: 'auto'
                        }}>
                            <Box sx={{ 
                                flexShrink: 0,
                                display: { xs: 'none', sm: 'block' } 
                            }}>
                                <ScheduleActionsBox 
                                    gridRef={gridRef} 
                                    scheduleTitle={sidebarTitle}
                                    courses={courses}
                                    isMySchedule={isMySchedule}
                                    titleColor={sidebarTitleColor}
                                    onSettingsClick={() => setIsSettingsModalOpen(true)}
                                />
                                <Box sx={{ border: '1px solid #eee', borderRadius: '4px', bgcolor: '#fff', overflow: 'hidden' }}>
                                {schedules.map((sch, idx) => (
                                    <Box 
                                        key={sch.id}
                                        onClick={() => handleSelectSchedule(idx)}
                                        sx={{ 
                                            p: '15px 20px', 
                                            borderBottom: '1px solid #f5f5f5', 
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            transition: '0.2s',
                                            bgcolor: activeScheduleIdx === idx ? '#fff9f9' : 'transparent',
                                            '&:hover': { bgcolor: '#fff9f9' }
                                        }}
                                    >
                                        <Typography sx={{ fontWeight: 'bold', color: '#000', fontSize: '15px' }}>
                                            {sch.name}
                                        </Typography>
                                        {(sch.is_default === 1 || sch.is_default === true) && (
                                            <Typography sx={{ fontSize: '12px', color: '#bbb' }}>기본시간표</Typography>
                                        )}
                                    </Box>
                                ))}
                                
                                {isMySchedule && (
                                    <Box 
                                            onClick={() => setIsNewScheduleModalOpen(true)}
                                            sx={{ 
                                                p: '15px 20px', 
                                                cursor: 'pointer', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: 1, 
                                                color: '#f91f15',
                                                '&:hover': { bgcolor: '#fcfcfc' }
                                            }}
                                        >
                                            <AddIcon sx={{ fontSize: '20px' }} />
                                            <Typography sx={{ fontWeight: 'bold', fontSize: '15px' }}>새 시간표 만들기</Typography>
                                    </Box>
                                )}
                                </Box>
                            </Box>

                            <Box sx={{ position: 'relative', minWidth: 0, width: '800px'}}>
                                {hasNoSchedules ? (
                                    <Box sx={{ 
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                                        height: '600px', bgcolor: '#fafafa', borderRadius: '8px', border: '1px dashed #ddd' 
                                    }}>
                                        <EventBusyIcon sx={{ fontSize: '80px', color: '#ddd', mb: 2 }} />
                                        <Typography sx={{ color: '#888', fontWeight: 'bold' }}>등록된 시간표가 없습니다.</Typography>
                                        {isMySchedule && (
                                            <Typography variant="caption" sx={{ color: '#aaa', mt: 1 }}>
                                                왼쪽 메뉴에서 '새 시간표 만들기'를 눌러주세요.
                                            </Typography>
                                        )}
                                    </Box>
                                ) : (
                                    <ScheduleContainer ref={gridRef}>
                                        <GridHeader>
                                            <div style={{ width: '60px' }}></div>
                                            {DAYS.map(day => <div key={day} className="day-label">{day}</div>)}
                                        </GridHeader>
                                        <GridBody>
                                            <TimeColumn>
                                                {TIMES.map(time => <div key={time} className="time-cell">{time} 시</div>)}
                                            </TimeColumn>
                                            <TimeIndicator startHour={8} />
                                            {DAYS.map((_, dayIndex) => (
                                                <DayColumn key={dayIndex} style={{ cursor: isMySchedule ? 'pointer' : 'default' }} onClick={(e) => isMySchedule && handleColumnClick(e, dayIndex)}>
                                                    {courses.filter(c => c.day === dayIndex).map(course => (
                                                        <Box
                                                            key={course.id}
                                                            onClick={(e) => handleCourseClick(e, course)}
                                                            sx={{
                                                                position: 'absolute', top: (course.start - 8) * 60, height: course.duration * 60,
                                                                left: '2px', right: '2px', backgroundColor: course.color,
                                                                border: `1px solid rgba(0,0,0,0.05)`, borderRadius: '4px', padding: '5px 0 0 8px', zIndex: 2,
                                                                overflow: 'hidden', cursor: isMySchedule ? 'pointer' : 'default'
                                                            }}
                                                        >
                                                            {isMySchedule && <button className="delete-btn" onClick={(e) => handleDeleteCourse(e, course.id)} style={{
                                                                position: 'absolute',
                                                                top: '2px',
                                                                right: '2px',
                                                                border: 'none',
                                                                background: 'rgba(0,0,0,0.1)',
                                                                borderRadius: '50%',
                                                                width: '16px',
                                                                height: '16px',
                                                                fontSize: '10px',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: '#555',
                                                                zIndex: 10,
                                                                padding: 0,
                                                                lineHeight: 1
                                                            }}>✕</button>}
                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold', lineHeight: 1.2, color: '#444' }}>{course.name}</Typography>
                                                            <Typography sx={{ fontSize: '10px', color: '#888', mt: 0.5 }}>{course.location}</Typography>
                                                        </Box>
                                                    ))}
                                                </DayColumn>
                                            ))}
                                        </GridBody>
                                    </ScheduleContainer>
                                )}
                            </Box>

                        </Box>
                        
                    </Box>
                    {isMySchedule && (
                        <AddCourseModal 
                            open={isModalOpen} 
                            onClose={() => setIsModalOpen(false)} 
                            initialData={editingCourse || selectedSlot}
                            isEditMode={!!editingCourse}
                            onSave={handleSaveCourse}
                            scheduleId={schedules[activeScheduleIdx]?.id}
                        />
                    )}
                    <CreateScheduleModal 
                        open={isNewScheduleModalOpen}
                        onClose={() => setIsNewScheduleModalOpen(false)}
                        onSave={handleCreateNewSchedule}
                    />
                    {schedules.length > 0 && (
                        <ScheduleSettingsModal 
                            open={isSettingsModalOpen}
                            onClose={() => setIsSettingsModalOpen(false)}
                            onSave={handleUpdateSchedule}
                            initialData={schedules[activeScheduleIdx]}
                            onDelete={handleDeleteFolder}
                        />
                    )}
                </div>
            </PageMargin>
            <Footer />
        </>
    );
};

export default SchedulePage;