import styled from "@emotion/styled";

export const CustomRankingTable = styled.div`
    width: 100%;
    max-width: 800px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    overflow: hidden;
    position: relative;
    margin-top: 10rem;

    .header {
        display: flex;
        align-items: center;
        padding: 20px 24px;
        border-bottom: 1px solid #eee;
    }

    .header-title {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 10px;
        color: #000;
        width: 100%;
    }

    .row {
        display: flex;
        align-items: center;
        padding: 16px 24px;
        border-bottom: 1px solid #f5f5f5;
        transition: background 0.2s;
    }

    &:hover {
        background-color: #fafafa;
    }

    .rank {
        font-weight: 800;
        width: 30px;
        color: #000;
    }

    .content {
        flex: 1;
        font-weight: 600;
        font-size: 15px;
        color: #333;
    }

    .status {
        font-size: 12px;
        font-weight: 800;
        color: #ffb300;
    }
    .list-wrapper {
        max-height: 270px; 
        overflow-y: auto;
        position: relative;

        &::-webkit-scrollbar { display: none; }
        scrollbar-width: none; 
    }

    .row {
        display: flex;
        align-items: center;
        padding: 16px 24px;
        height: 54px;
        box-sizing: border-box;
        border-bottom: 1px solid #f5f5f5;
    }

    .fade-overlay {
        position: absolute;
        bottom: 52px;
        left: 0;
        width: 100%;
        height: 40px;
        background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1));
        pointer-events: none;
        z-index: 2;
    }

    .footer-button {
        background-color: #FA5F55;
        color: white;
        text-align: center;
        padding: 15px;
        font-weight: 700;
        position: relative;
        z-index: 3;
    }
`;