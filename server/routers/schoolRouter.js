import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/list', async(req, res) => {
    try {
        let sql = `SELECT * FROM schools`;

        let [rows] = await pool.query(sql, []);
        res.json({schoolList: rows});
    } catch(err) {
        res.status(500).json({errno: 2, msg: '학교 가져오기 실패.'});
    }

});

export default router;