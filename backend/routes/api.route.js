import express from 'express'
import { getReq, createReq } from '../controllers/api.controller.js'

const router = express.Router()

router.get("/", getReq);

router.post("/", createReq);

export default router;