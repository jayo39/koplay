import { CustomRankingTable } from "../styles/components/rankingTable.styles";

const RankingTable = () => {
    const rankings = [
        { id: 1, text: "제목 1 입니다", status: "NEW" },
        { id: 2, text: "제목 2 입니다", status: "NEW" },
        { id: 3, text: "제목 3 입니다", status: "DOWN" },
        { id: 4, text: "제목 4 입니다", status: "DOWN" },
        { id: 5, text: "제목 5 입니다", status: "DOWN" }, // Scroll starts after this
        { id: 6, text: "제목 6 입니다", status: "NEW" },
        { id: 7, text: "제목 7 입니다", status: "NEW" },
        { id: 8, text: "제목 8 입니다", status: "NEW" },
        { id: 9, text: "제목 9 입니다", status: "NEW" },
        { id: 10, text: "제목 10 입니다", status: "NEW" },
    ];

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <CustomRankingTable>
                <div className="header">
                    <div className="header-title">
                        <div>
                            <h2>실시간 인기 글</h2>
                        </div>
                        <div>2026-02-01 03:00 기준</div>
                    </div>
                </div>
                
                <div className="list-wrapper">
                    {rankings.map((item) => (
                        <div className="row" key={item.id} style={{ opacity: item.isFaded ? 0.3 : 1 }}>
                            <div className="rank">{item.id}</div>
                            <div className="content">{item.text}</div>
                            <div className="status">
                                {item.status === "NEW" ? "NEW" : "▼"}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="fade-overlay" />

                <div className="footer-button">
                    실시간 인기 글 자세히보기
                </div>
            </CustomRankingTable>
        </div>
    );
}

export default RankingTable;