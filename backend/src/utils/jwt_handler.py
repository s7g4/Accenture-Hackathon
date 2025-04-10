from datetime import datetime, timedelta
from jose import JWTError, jwt
from config import settings

# Encode a JWT token for the given user data
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    
    # Set token expiration
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    
    # Encode the JWT
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

# Decode a JWT token and return the payload
def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
