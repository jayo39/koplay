import styled from "@emotion/styled";

export const CustomLoginPage = styled.div`
    font-family: "Pretendard", sans-serif;
    margin-top: 10rem;

    input {
        box-sizing: border-box;
        transition: border-color 0.2s ease-in-out;
        outline: none;
        font-size: 14px;
        font-weight: 600;
        padding: 25px 25px; 
        border-radius: 15px;
        border: 2px solid #eeeeee;
        height: 20px;
        width: 100%;
    }

    input:focus {
        border-color: #ef9a9a;
    }

    & .MuiButton-root {
        font-family: "Pretendard", sans-serif;
        font-weight: 500;
        font-size: 14px;
        text-transform: none;
    }
`;