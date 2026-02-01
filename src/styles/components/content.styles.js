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
`;