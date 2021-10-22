import config from '../config';
import BaseService from './BaseService';

class UserService extends BaseService {
    async createUser(data) {
        const res = await this.call(
            'post',
            `${config.backendUrl}/users`,
            data
        );
        return res.data;
    }
    async deleteUser(id) {
        const res = await this.call(
            'delete',
            `${config.backendUrl}/users/${id}`
        );
        return res.data;
    }
    async getUser(id) {
        const res = await this.call(
            'get',
            `${config.backendUrl}/users/${id}`
        );
        return res.data;
    }
    async getUsers() {
        const res = await this.call(
            'get',
            `${config.backendUrl}/users`
        );
        return res.data;
    }
    async resetPassword(data) {
        const res = await this.call(
            'post',
            `${config.backendUrl}/users/admin-reset-password`,
            data
        );
        return res.data;
    }
    async updateUser(id,data) {
        const res = await this.call(
            'put',
            `${config.backendUrl}/users/${id}`,
            data
        );
        return res.data;
    }
        
}
export default UserService;
