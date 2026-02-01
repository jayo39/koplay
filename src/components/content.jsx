import { CustomContent } from "../styles/components/content.styles";
import { Chip } from "@mui/material";
import { motion } from "framer-motion";

const Content = () => {
    const list = [
        {id: 1, chip: '플랫폼', title: <>캐나다 최초 <br/> 대학생활 플랫폼</>, subtitle: '캐나다 현지 대학생이 직접 개발한, 대학생을 위한 웹사이트입니다.'},
        {id: 2, chip: '게시판', title: <>우리만의 소통공간 <br/> 커뮤니티</>, subtitle: '대학생활의 다양한 정보와 이야기를 자유롭게 나눠보세요.'},
        {id: 3, chip: '시간표', title: <>쉽게 만들고, <br/> 편하게 쓰는 시간표</>, subtitle: '강의 일정을 시간표로 쉽고 편하게 관리해 보세요.'}
    ];

    return (
        <CustomContent>
            <div className="content-inner">
                {list.map((el) => (
                    <motion.div
                        key={el.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{ marginBottom: '192px' }}
                    >
                        <Chip label={el.chip} />
                        <div className="contentTitle">{el.title}</div>
                        <div className="contentSubTitle">{el.subtitle}</div>
                    </motion.div>
                ))}
            </div>
        </CustomContent>
    );
}

export default Content;