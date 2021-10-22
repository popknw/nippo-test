import config from '../config';
import BaseService from './BaseService';

class StockService extends BaseService {
    async cancelExport(id) {
        const res = await this.call(
            'post',
            `${config.backendUrl}/stock-exports/${id}/cancel`
        );
        return res.data;
    }
    async cancelImport(id) {
        const res = await this.call(
            'post',
            `${config.backendUrl}/stock-imports/${id}/cancel`
        );
        return res.data;
    }
    async exportStock(data) {
        const res = await this.call(
            'post',
            `${config.backendUrl}/stock-exports`,
            data
        );
        return res.data;
    }
    async getStockExports() {
        const res = await this.call(
            'get',
            `${config.backendUrl}/stock-exports`
        );
        return res.data;
    }
    async getStockImports() {
        const res = await this.call(
            'get',
            `${config.backendUrl}/stock-imports`
        );
        return res.data;
    }
    async getStockTransactions(queryParams) {
        const res = await this.call(
            'get',
            `${config.backendUrl}/stock-transactions`,
            {},
            {params: queryParams}
        );
        return res.data;
    }
    async importStock(data) {
        const res = await this.call(
            'post',
            `${config.backendUrl}/stock-imports`,
            data
        );
        return res.data;
    }
    async getStockAdjustment() {
        const res = await this.call(
            'get',
            `${config.backendUrl}/stock-adjustments`
        );
        return res.data;
    }
    async adjustmentStock(data) {
        const res = await this.call(
            'post',
            `${config.backendUrl}/stock-adjustment`,
            data
        );
        return res.data;
    }
    async cancelAdjustment(id) {
        const res = await this.call(
            'post',
            `${config.backendUrl}/stock-adjustment/${id}/cancel`
        );
        return res.data;
    }
    
}
export default StockService;
