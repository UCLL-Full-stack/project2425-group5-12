import jwt from 'jsonwebtoken';
const generateJwtToken = ({ userEmail }: { userEmail: string }): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('Error generating JWT token.');
    }
    const options = { expiresIn: `${process.env.JWT_EXPIRES_HOURS}h`, issuer: 'taskIt_app' };

    try {
        return jwt.sign({ userEmail }, secret, options);
    } catch (error) {
        console.log(error);
        throw new Error('Error generating JWT token.');
    }
};

export default generateJwtToken;
