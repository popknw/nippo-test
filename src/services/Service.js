import config from '../config';
import BaseService from './BaseService';

class Service extends BaseService {
    async forgotPassword(data) {
        const res = await this.call(
            'post',
            `${config.backendUrl}/forgot-password`,
            data
        );
        return res.data;
    }
    async getCategories() {
        const res = await this.call(
            'get',
            `${config.backendUrl}/categories`
        );
        return res.data;
    }
    async createCategory(data) {
        const res = await this.call(
            'post',
            `${config.backendUrl}/categories`, data
        );
        return res.data;
    }
    async updateCategory(id, data) {
        const res = await this.call(
            'put',
            `${config.backendUrl}/categories/${id}`, data
        );
        return res.data;
    }
    async getDiscounts() {
        const res = await this.call(
            'get',
            `${config.backendUrl}/discounts`
        );
        return res.data;
    }

    async createDiscounts(data) {
        const res = await this.call(
            'post',
            `${config.backendUrl}/discounts/`, data
        );
        return res.data;
    }
    async updateDiscounts(id, data) {
        const res = await this.call(
            'put',
            `${config.backendUrl}/discounts/${id}`, data
        );
        return res.data;
    }
    async getOrders(queryParams) {
        const queryString = queryParams
            ? new URLSearchParams(queryParams)
            : '';

        const res = await this.call(
            'get',
            `${config.backendUrl}/orders?${queryString}`
        );
        return res.data;
    }
    async getRoles() {
        const res = await this.call(
            'get',
            `${config.backendUrl}/roles`
        );
        return res.data;
    }
    async getUnits() {
        const res = await this.call(
            'get',
            `${config.backendUrl}/units`
        );
        return res.data;
    }
}
export default Service;
