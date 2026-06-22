import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sawariya_secret_jwt_access_token_key_777!';

export function verifyAdmin(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
}
