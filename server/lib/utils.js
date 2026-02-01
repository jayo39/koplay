import jwt from 'jsonwebtoken';

export const loginRequired = (req, res, next) => {
    const token = req.headers.authorization.replace('Bearer ', '');
    try {
        let loginUser = jwt.verify(token, 'TLtoken');
        let loginUsername = loginUser.username;
        let loginId = loginUser.id;

        req.loginUsername = loginUsername;
        req.loginId = loginId;
        next();
    } catch(err) {
        if(err.name === 'JsonWebTokenError') {
            res.status(500).json({errno:1, msg:'로그인 인증 실패.'});
            return;
        } else if (err.name === 'TokenExpiredError') {
            res.status(500).json({errno:2, msg:'세션이 만료되어 다시 로그인해 주세요.'});
            return;
        } else {
            res.status(500).json({errno:3, msg:'다시 시도해 주세요.'});
            return;
        }
    }
};