import { Router } from "express";
import { bookingdone, bookingissue, findAvailableCycle } from "../controllers/booking.controller.js";
import { AdminverifyJwt } from '../Middleware/AdminauthMiddleware.js';
import { verifyJwt } from '../Middleware/auth.middleware.js';

const bookingRouter=Router();
bookingRouter.post('/findcycle',findAvailableCycle);
bookingRouter.post('/bookingissue',bookingissue);
bookingRouter.post('/bookingdone',bookingdone);

export default bookingRouter;