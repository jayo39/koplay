import { CustomMainBanner } from "../styles/components/mainBanner.styles.js";

const MainBanner = () => {
    return (
        <CustomMainBanner>
            <h1 style={{ letterSpacing: '-0.5px' }}>
                캐나다 <span className="mobile-br" /> 유학생을 위한
                <span className="desktop-br"><br /></span>
                <span className="mobile-br" />
                커뮤니티 플랫폼, <span className="mobile-br" />
                <span style={{ color: '#e7110d' }}>코바이브</span>
            </h1>
            
            <p style={{ color: '#848a92', fontWeight: 'bold', fontSize: '1.25rem', marginTop: '-20px' }}>
                대학생활의 다양한 정보와 이야기를 <span className="mobile-br" /> 
                다른 학생들과 자유롭게 나눠보세요.
                <br className="desktop-br" />
                <span className="mobile-br" />
                대학생을 위해, 대학생이 만든 플랫폼.
            </p>
        </CustomMainBanner>
    );
}

export default MainBanner;