import Header from "../components/header";
import SearchBar from "../components/searchBar";
import { CustomPostPage } from "../styles/pages/post.styles";

const PostPage = () => {
    return (
        <>
            <Header></Header>
            <CustomPostPage>
                <div style={{ fontSize: '25px', fontWeight: 'bold' }}>
                    텔레그노시스 게시판
                </div>
                <div style={{marginBottom: '-10px', fontWeight: 'bold', color: '#848a92'}}>검색할 포스트</div>
                <SearchBar></SearchBar>
            </CustomPostPage>
        </>
        
    )
}

export default PostPage;