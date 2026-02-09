import { Box, Typography, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SettingsIcon from '@mui/icons-material/Settings';
import html2canvas from 'html2canvas';

const ScheduleActionsBox = ({ scheduleTitle, titleColor, gridRef, courses, isMySchedule, onSettingsClick }) => {
    
    const getLatestDate = () => {
        if (!courses || courses.length === 0) return "변경 사항 없음";
        const validDates = courses.filter(c => c.modifiedAt && !isNaN(Date.parse(c.modifiedAt)));
        if (validDates.length === 0) return "변경 사항 없음";

        const latest = courses.reduce((prev, current) => {
            return (prev.modifiedAt > current.modifiedAt) ? prev : current;
        });

        const date = new Date(latest.modifiedAt);
        return date.toLocaleString('en-US', {
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) + ' 변경';
    };

    const handleDownloadImage = async () => {
        if (!gridRef.current) return;
        
        try {
            const canvas = await html2canvas(gridRef.current, {
                backgroundColor: '#ffffff',
                scale: 2,
            });
            
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = `${scheduleTitle}.png`;
            link.click();
        } catch (err) {
            console.error("이미지 저장 실패:", err);
            alert("이미지 저장 중 오류가 발생했습니다.");
        }
    };

    return (
        <Box sx={{ 
            p: 2, 
            border: '1px solid #eee', 
            borderRadius: '4px', 
            display: 'inline-block',
            mb: 1,
            backgroundColor: '#fff',
            minWidth: '180px'
        }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5, color: titleColor || '#000' }}>
                {scheduleTitle}
            </Typography>
            <Typography variant="caption" sx={{ color: '#aaa', display: 'block', mb: 2 }}>
                {getLatestDate()}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                    variant="outlined" 
                    size="small"
                    startIcon={<FileDownloadIcon sx={{ color: '#f91f15' }} />}
                    onClick={handleDownloadImage}
                    sx={{ color: '#555', borderColor: '#ddd', '&:hover': { borderColor: '#bbb' } }}
                >
                    이미지
                </Button>
                {isMySchedule && (
                    <Button 
                        variant="outlined" 
                        size="small"
                        startIcon={<SettingsIcon sx={{ color: '#f91f15' }} />}
                        onClick={onSettingsClick}
                        sx={{ color: '#555', borderColor: '#ddd', '&:hover': { borderColor: '#bbb' } }}
                    >
                        설정
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default ScheduleActionsBox;