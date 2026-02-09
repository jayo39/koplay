import { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Carousel = ({ items = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    };

    if (!items.length) return <Box>No items to display</Box>;

    return (
        <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden', borderRadius: '8px' }}>
            <Box
                sx={{
                    display: 'flex',
                    transition: 'transform 0.5s ease-in-out',
                    transform: `translateX(-${currentIndex * 100}%)`,
                }}
            >
                {items.map((item, index) => (
                    <Box
                        key={index}
                        sx={{
                            minWidth: '100%',
                            height: '100px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#eee'
                        }}
                    >
                        {item}
                    </Box>
                ))}
            </Box>

            {/* Navigation Buttons */}
            <IconButton 
                onClick={handlePrev} 
                sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: '#fff' } }}
            >
                <ArrowBackIosNewIcon />
            </IconButton>

            <IconButton 
                onClick={handleNext} 
                sx={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: '#fff' } }}
            >
                <ArrowForwardIosIcon />
            </IconButton>

            {/* Indicators (Dots) */}
            <Box sx={{ position: 'absolute', bottom: 10, width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                {items.map((_, idx) => (
                    <Box
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: currentIndex === idx ? 'white' : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer'
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default Carousel;