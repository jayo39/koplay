import { CustomLatestUpdate } from "../styles/components/latestUpdate.styles";
import { Chip } from "@mui/material";

const LatestUpdate = () => {
    return (
        <CustomLatestUpdate>
            <div className="inner-container" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{color: '#374151'}}>새로운 공지</div>
                <div style={{color: '#848a92'}}>운영자</div>
            </div>
        </CustomLatestUpdate>
    )
}

export default LatestUpdate;