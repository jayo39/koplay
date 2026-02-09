import styled from "@emotion/styled";

export const CustomHeader = styled.header`
    font-family: "Pretendard Variable", sans-serif;
    font-weight: 600;
    box-sizing: border-box;
    background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    width: 100%;
    padding: 20px;
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);

    .header-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin: 0 auto;
    }

    .left-section {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .nav-links {
        display: flex;
        align-items: center;
        column-gap: 10px;
        margin-left: 10px;
    }

    .right-section {
        display: flex;
        align-items: center;
    }

    .auth-links {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    & .MuiButton-root {
        font-family: "Pretendard Variable", sans-serif;
        font-weight: 600;
        font-size: 14px;
        text-transform: none;
        padding: 8px 16px;
    }

    .mobile-menu-icon {
        display: none;
    }

    @media (max-width: 900px) {
        .nav-links, 
        .auth-links {
            display: none; /* Hide desktop elements */
        }

        .mobile-menu-icon {
            display: block;
        }

        .header-container {
            justify-content: space-between; /* Keeps Logo left and Hamburger right */
        }
    }
`;