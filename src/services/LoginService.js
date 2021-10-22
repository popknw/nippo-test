import config from '../config';
import BaseService from './BaseService';

class LoginService extends BaseService {
    async login(data) {
        const res = await this.call(
            'post',
            `${config.backendUrl}/login`,
            data
        );
        return res.data;
    }
    async logout() {
        const res = await this.call(
            'get',
            `${config.backendUrl}/logout`
        );
        return res.data;
    }
}
export default LoginService;
