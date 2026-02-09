import styled from "@emotion/styled";

export const CustomContent = styled.div`
    font-family: "Pretendard", sans-serif;
    margin-top: 10rem;
    padding: 0 48px;
    display: flex;
    justify-content: center;

    .content-inner {
        width: 100%;
        max-width: 1200px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    & .MuiChip-root {
        background-color: #ffcdd2;
        color: #c62828;
        font-weight: 500;
        border-radius: 50px;
        width: fit-content;
        font-size: 1rem;
        margin-bottom: 16px;
    }

    .contentTitle {
        font-size: 48px;
        font-weight: 600;
        color: #000;
        line-height: 1.3;
    }

    .contentSubTitle {
        margin-top: 1rem;
        font-size: 20px;
        font-weight: 500;
        color: #848a92;
    }

    .feature-showcase {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 50px;
        padding: 40px;
        gap: 0.75rem;
        max-height: 300px;
        background-color: #f9fafb;
        overflow: visible; 
        border-radius: 1rem;
        overflow: hidden;
    }

    .showcase-text {
        flex: 1;
    }

    .showcaseTitle {
        font-size: 1.875rem;
        font-weight: bold;
        line-height: 1.3;
        color: #000;
        margin-bottom: 8px !important;
    }

    .showcaseSubTitle {
        font-size: 1.125rem;
        line-height: 1.75rem;
        color: #666;
        font-weight: 400;
    }

    .showcase-image-wrapper {
        flex: 1.5;
        display: flex;
        justify-content: flex-end;
        position: relative;
        transform: translate(15%, 22%);
    }

    .mockup-frame img {
        width: 100%;
        height: auto;
        border-radius: 24px 24px 0 0;

        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: -10px 20px 20px rgba(0, 0, 0, 0.05);
    }

    @media (max-width: 1100px) {
        .feature-showcase {
            flex-direction: column;
            text-align: center;
            height: 320px;
        }
        .showcase-text { min-width: 100%; }
        .mockup-frame {
            width: 100%;
            transform: translateX(0);
        }
        .showcase-image-wrapper { transform: translate(24%, 22%); margin-top: -40px; }
        .showcaseTitle { font-size: 1.3rem; }
        .showcaseSubTitle { font-size: 1.0rem; }
    }
`;