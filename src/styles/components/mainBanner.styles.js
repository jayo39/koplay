// mainBanner.styles.js
import styled from "@emotion/styled";

export const CustomMainBanner = styled.div`
    font-family: "Pretendard", sans-serif;
    font-weight: 700;
    font-size: 25px;
    color: #000;
    text-align: center;
    margin-top: 10rem;
    padding: 0 20px;

    h1 {
        line-height: 1.4;
    }

    p {
        line-height: 1.6;
    }

    .mobile-br {
        display: none;
    }

    @media (max-width: 900px) {
        font-size: 20px;
        
        .mobile-br {
            display: block;
            content: "";
            margin-top: 5px;
        }

        .desktop-br {
            display: none;
        }
    }
`;