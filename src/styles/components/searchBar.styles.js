import styled from "@emotion/styled";

export const CustomSearchBar = styled.div`
    input {
        transition: border-color 0.2s ease-in-out;
        outline: none;
        font-size: 14px;
        font-weight: 500;
        width: 430px;
        padding: 15px 15px; 
        border-radius: 100px;
        border: 2px solid #eeeeee;
        height: 20px;
    }

    input:focus {
        border-color: #ef9a9a;
    }

    & .MuiButton-root {
        font-family: "Pretendard", sans-serif;
        font-weight: bold;
        font-size: 14px;
        text-transform: none;
        padding: 10px 20px;
    }
`;
