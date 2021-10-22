import axios from 'axios';

class BaseService {
    static toApiDateFormat(date) {
        if(!date || date === null) {
            return null;
        }
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const day = date.getDate();

        return `${year}-${month}-${day}`;
    }
    constructor(token, callbacks) {
        this.axios = axios.create({});
        if (token) {
            this.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        this.callbacks = callbacks;
    }
    
    async call(method, url, data, options) {
        try {
            if (['get', 'post', 'put', 'delete'].indexOf(method) === -1) {
                throw new Error(`Method "${method}" not supported.`);
            }

            return await this.axios({
                data, 
                method, 
                url,
                ...options,
            });
        } catch (e) {
            if (e.response && e.response.status === 401) {
                this.callbacks.onUnAuthorized(e);
        
                return {data: undefined};
            }

            this.callbacks.onError(e);
      
            return {data: undefined};
        }
    }
    
}

export default BaseService;
