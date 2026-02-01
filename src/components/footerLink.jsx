import { Link } from "react-router-dom";

const FooterLinks = () => {
    const menus = [
        {id: 1, title: '공지사항'},
        {id: 2, title: '문의하기'},
        {id: 3, title: '개인정보처리방침'},
    ];

    return (
        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center'}}>
            <div style={{ display: 'flex', flexDirection: 'column'}}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    {menus.map((el, index) => (
                        <div key={el.id} style={{ display: 'flex', alignItems: 'center' }}>
                            <Link 
                                style={{ textDecoration: 'none', color: '#737373', fontSize: '13px' }} 
                                to={el.id === 1 ? '/news' : el.id === 2 ? '/' : '/privacy'}
                            >
                                {el.title}
                            </Link>
                            {index < menus.length - 1 && (
                                <span style={{ 
                                    width: '1px', 
                                    height: '10px', 
                                    backgroundColor: '#d1d1d1', 
                                    margin: '0 10px' 
                                }} />
                            )}
                        </div>
                    ))}
                </div>
                <div style={{color: '#737373', fontWeight: '600', fontSize: '13px'}}>© 텔레그노시스 telegnosis</div>
            </div>
        </div>
    )
}

export default FooterLinks;