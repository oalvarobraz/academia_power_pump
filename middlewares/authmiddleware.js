const jwt = require('jsonwebtoken');
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;

// Verifica se o login foi autorizado
const authMiddleware = (req, res, next ) => {
    const token = req.cookies.token;

    // Verificar se esta logado
    if (req.cookies.token === undefined) {
        return res.status(401).json({
            message: "You are not logged in",
            status: "error",
        });
    }

    if(!token) {
        return res.status(401).json( { message: 'Unauthorized'} );
    }
  
    try {
        const decoded = jwt.verify(token, jwtSecret);
  
        if (decoded.userId !== process.env.ADM_USER) {
            return res.status(403).json({ message: 'Access forbidden' });
        }
  
        req.userId = decoded.userId;
        next();
    } catch(error) {
        console.log(error);
        res.status(401).json( { message: 'Unauthorized'} );
    }
}


module.exports = authMiddleware;