import React from 'react';
import Header from "../components/header";
import Footer from "../components/footer";
import { PageMargin } from "../styles/pages/pageMargin";
import { Box, Grid, Typography, Container } from "@mui/material";

import VerifiedIcon from '@mui/icons-material/VerifiedUser';
import LockIcon from '@mui/icons-material/Lock';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SyncIcon from '@mui/icons-material/Sync';
import CloudIcon from '@mui/icons-material/Cloud';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const PrivacyBlock = ({ icon: Icon, title, description }) => (
    <Box sx={{ mb: 4, width: '100%' }}>
        <Box sx={{ 
            width: 44, 
            height: 44, 
            backgroundColor: '#f4f4f4', 
            borderRadius: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mb: 2 
        }}>
            <Icon sx={{ color: '#999', fontSize: '24px' }} />
        </Box>
        <div style={{ fontFamily: '"Pretendard Variable", sans-serif', fontWeight: 700, mb: 1, color: '#000', fontSize: '1.1rem', wordBreak: 'keep-all' }}>
            {title}
        </div>
        <div style={{ fontFamily: '"Pretendard Variable", sans-serif', fontWeight: 400, color: '#374151', lineHeight: 1.6, fontSize: '0.9rem', wordBreak: 'keep-all', marginTop: '7px' }}>
            {description}
        </div>
    </Box>
);

const PrivacyPage = () => {
    const privacyContent = [
        { icon: VerifiedIcon, title: "서비스에 가입할 때", description: "메일인증을 통해 본인임을 확인하는 과정을 거칩니다. 최소한의 개인정보만을 수집하여 걱정을 덜었습니다." },
        { icon: LockIcon, title: "강력한 개인정보 보호", description: "가입 시 입력하는 이름, 비밀번호 등의 개인정보는 강력한 암호 알고리즘을 통해 암호화되어 있습니다." },
        { icon: SaveAltIcon, title: "성적을 입력할 때", description: "모든 성적 데이터는 암호화되어 저장됩니다. 이를 통해 데이터베이스 관리자조차도 해당 점수가 누구의 것인지, 그리고 점수가 무엇인지 확인할 수 없습니다." },
        { icon: SyncIcon, title: "데이터의 이동", description: "이용자의 디바이스에서 서비스의 서버까지 데이터가 움직이는 모든 구간은 SSL(HTTPS)에 의해 암호화되어 통신됩니다." },
        { icon: CloudIcon, title: "웹사이트의 물리적 보안", description: "세계 최고 클라우드 서버를 제공하는 Amazon Web Services에서 세계 최고의 물리적 보안을 제공합니다." },
        { icon: DeleteForeverIcon, title: "탈퇴 후 모두 파기되는 개인정보", description: "회원정보 및 성적정보를 비롯한 개인정보는 탈퇴 시점에 모두 파기됩니다. 법령에 의거한 경우에만 예외적으로 보존됩니다." }
    ];

    return (
        <>
            <Header />
            <PageMargin>
                <Container maxWidth="lg" sx={{ py: 10 }}>
                    <Box sx={{display: 'grid', gridTemplateColumns: {xs: '1fr', sm: '1fr 1fr'}, gap: '50px'}}>
                        {privacyContent.map((item, index) => (
                            <Grid item xs={6} sm={6} md={6} key={index}>
                                <PrivacyBlock 
                                    icon={item.icon} 
                                    title={item.title} 
                                    description={item.description} 
                                />
                            </Grid>
                        ))}
                    </Box>
                </Container>
            </PageMargin>
            <Footer />
        </>
    );
};

export default PrivacyPage;