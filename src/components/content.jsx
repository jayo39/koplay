import { CustomContent } from "../styles/components/content.styles";
import { Chip } from "@mui/material";
import { motion } from "framer-motion";
import scheduleMockup from "../assets/schedule.png";
import postMockup from "../assets/post.png";
import mainMockup from "../assets/main.png"

const Content = () => {
    const list = [
        {
            id: 1, 
            chip: '플랫폼', 
            title: <>캐나다 최초 <br/> 대학생활 플랫폼</>, 
            subtitle: '캐나다 현지 대학생이 직접 개발한, 대학생을 위한 웹사이트입니다.',
            showcaseTitle: '학교 생활에 최적화된 환경',
            showcaseDesc: ['언제 어디서든 쉽고 빠르게', '우리 학교 소식을 확인하세요.'],
            image: mainMockup
        },
        {
            id: 2, 
            chip: '게시판', 
            title: <>우리만의 소통공간 <br/> 커뮤니티</>, 
            subtitle: '대학생활의 다양한 정보와 이야기를 자유롭게 나눠보세요.',
            showcaseTitle: '익명으로 나누는 이야기',
            showcaseDesc: ['자유게시판부터 정보게시판까지,', '다양한 카테고리에서 소통해보세요.'],
            image: postMockup
        },
        {
            id: 3, 
            chip: '시간표', 
            title: <>쉽게 만들고, <br/> 편하게 쓰는 시간표</>, 
            subtitle: '강의 일정을 시간표로 쉽고 편하게 관리해 보세요.',
            showcaseTitle: '시간표 한눈에 보기',
            showcaseDesc: ['직관적인 색으로 시간표를 정리하고 한눈에 확인하세요.', '친구와 공유하거나 이미지로 저장할 수 있습니다.'],
            image: scheduleMockup
        }
    ];

    return (
        <CustomContent>
            <div className="content-inner">
                {list.map((el) => (
                    <div key={el.id} className="content-section" style={{ marginBottom: '100px' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.3 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            style={{ marginBottom: '48px' }}
                        >
                            <Chip label={el.chip} />
                            <div className="contentTitle">{el.title}</div>
                            <div className="contentSubTitle">{el.subtitle}</div>
                        </motion.div>

                        <motion.div 
                            className="feature-showcase"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.3 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        >
                            <div className="showcase-text">
                                <div className="showcaseTitle">
                                    {el.showcaseTitle}
                                </div>
                                {el.showcaseDesc.map((desc, idx) => (
                                    <div key={idx} className="showcaseSubTitle">
                                        {desc}
                                    </div>
                                ))}
                            </div>

                            <div className="showcase-image-wrapper">
                                <div className="mockup-frame">
                                    <img src={el.image} alt={`${el.chip} Preview`} />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>
        </CustomContent>
    );
}

export default Content;