import config from '../config';
import BaseService from './BaseService';

class ReportsService extends BaseService {
    async getBelowSafetyStockItems() {
        const res = await this.call(
            'get',
            `${config.backendUrl}/reports/below-safety-stock-items`
        );
        return res.data;
    }
    async getBestSellerItems() {
        const res = await this.call(
            'get',
            `${config.backendUrl}/reports/best-seller-items`
        );
        return res.data;
    }
    async getProfitAndLoss(queryParams) {
        const res = await this.call(
            'get',
            `${config.backendUrl}/reports/profit-and-loss`,
            {},
            queryParams
        );
        return res.data;
    }
    async getUserLog() {
        const res = await this.call(
            'get',
            `${config.backendUrl}/reports/user-logs`
        );
        return res.data;
    }
    async getSaleSummary(queryParams) {
        const res = await this.call('get', `${config.backendUrl}/reports/sales-summary`, {}, { params: queryParams });
        return res.data;
    }
    async getProfileSummary(queryParams) {
        const res = await this.call('get', `${config.backendUrl}/reports/profile-summary`, {}, { params: queryParams });
        return res.data;
    }
    async getItemRepoet(queryParams) {
        const res = await this.call('get', `${config.backendUrl}/reports/item`, {}, { params: queryParams });
        return res.data;
    }
    async getItemChart(queryParams) {
        const res = await this.call('get', `${config.backendUrl}/reports/sales-graph`, {}, { params: queryParams });
        return res.data;
    }
    async getCategoryReport(queryParams) {
        const res = await this.call('get', `${config.backendUrl}/reports/category`, {}, { params: queryParams });
        return res.data;
    }
    async getReceiptReport(queryParams) {
        const res = await this.call('get', `${config.backendUrl}/reports/receipt`, {}, { params: queryParams });
        return res.data;
    }
    async getEmployeeReport(queryParams) {
        const res = await this.call('get', `${config.backendUrl}/reports/personnel`, {}, { params: queryParams });
        return res.data;
    }
    async getPaymentReport(queryParams) {
        const res = await this.call('get', `${config.backendUrl}/reports/payment`, {}, { params: queryParams });
        return res.data;
    }
    async getDiscountReport(queryParams) {
        const res = await this.call('get', `${config.backendUrl}/reports/discount`, {}, { params: queryParams });
        return res.data;
    }
    async getTaxSummaryReport() {
        const res = await this.call('get', `${config.backendUrl}/reports/vat-summary`);
        return res.data;
    }
    async getTaxOverViewReport() {
        const res = await this.call('get', `${config.backendUrl}/reports/vat-overview`);
        return res.data;
    }

}
export default ReportsService;
