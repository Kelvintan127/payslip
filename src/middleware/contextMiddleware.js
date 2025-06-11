import { v4 as uuidv4 } from "uuid";

function contextMiddleware(req, res, next) {
    const rawIp = req.headers['x-forwarded-for']?.split(',').shift()?.trim() || req.ip;
    const ipAddress = (rawIp === '::1') ? '127.0.0.1' : rawIp;
    
req.context = {
    userId: req.user?.id || null,
    username: req.user?.username || 'system',
    ipAddress,
    requestId: uuidv4(), 
};

res.setHeader('X-Request-Id', req.context.requestId);

next();
}

export default contextMiddleware;