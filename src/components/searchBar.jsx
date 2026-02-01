import { CustomSearchBar } from "../styles/components/searchBar.styles";
import { Button } from "@mui/material";

const SearchBar = () => {
    return (
        <CustomSearchBar>
            <div style={{display: 'flex', justifyContent: 'center', columnGap: '15px'}}>
                <input placeholder="검색어를 입력해주세요">
                </input>
                <Button style={{backgroundColor: '#000', borderRadius: '100px', height: '52px', fontWeight: 'bold'}} variant="contained" disableElevation>검색하기</Button>
            </div>
            
        </CustomSearchBar>
    )
}

export default SearchBar;