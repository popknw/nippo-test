import config from '../config';
import BaseService from './BaseService';

class ItemService extends BaseService {
    async create(data) {
        const res = await this.call(
            'post',
            `${config.backendUrl}/items`,
            data
        );
        return res.data;
    }
    async get(id) {
        const res = await this.call(
            'get',
            `${config.backendUrl}/item${id}`,
        );
        return res.data;
    }
    
    async list(queryParams) {
        const res = await this.call(
            'get',
            `${config.backendUrl}/items`,
            {},
            {params: queryParams}
        );
        return res.data;
    }

    async update(id, data) {
        const res = await this.call(
            'put',
            `${config.backendUrl}/items/${id}`,
            data
        );
        return res.data;
    }
    
}
export default ItemService;
