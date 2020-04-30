
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/constants';

class JWT {
    private secretKey = SECRET_KEY as string;

    sign(data: any): string {                   // 24 horas, 60 minutos, 60 segundos.
        return jwt.sign({user: data.user}, this.secretKey, { expiresIn: 24 * 60 * 60});
    }

    verify(token: string): string {
        try {
            return jwt.verify(token, this.secretKey) as string;
        } catch (e) {
            return 'La autenticación del token es inválida, por favor inicia sesion para obtener un nuevo token';
        }
    }
}

export default JWT;