import styled from "@emotion/styled";

export const CustomHeader = styled.header`
    font-family: "Pretendard Variable", sans-serif;
    font-weight: 600;
    box-sizing: border-box;
    background-color: #fff;
    width: 100%;
    padding: 20px;

    position: sticky;
    top: 0;
    z-index: 1000;

    background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);

    & .MuiButton-root {
        font-family: "Pretendard Variable", sans-serif;
        font-weight: 600;
        font-size: 14px;
        text-transform: none;
        padding: 10px 20px;
    }
    
    @media (max-width: 900px) {
        .header-container {
            justify-content: flex-end;
        }
    }

    .header-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }

    .nav-links {
        display: flex;
        align-items: center;
        column-gap: 15px;
    }

    @media (max-width: 900px) {
        .nav-links {
            display: none; 
        }
        .mobile-menu-icon {
            display: block !important;
        }
    }

    .mobile-menu-icon {
        display: none;
    }
`;