
export default class DataTableService {

    dateFilter(start,end,data,field ){
        // Make sure we compare only date not the time.
        // And default the value that always give true when comparing if the value is not set.
        let startDate, endDate;
        if(!start || start === null) {
            startDate = 0;
        }
        else {
            const tmpDate = new Date(start);
            tmpDate.setHours(0,0,0);
            startDate = tmpDate.getTime();
        }

        if(!end || end === null) {
            endDate = Number.MAX_SAFE_INTEGER;
        }
        else {
            const tmpDate = new Date(end);
            tmpDate.setHours(0,0,0);
            endDate = tmpDate.getTime();
        }
    
        const result = data.filter(d => {
            const date = (new Date(d[`${field}`]));
            date.setHours(0,0,0);

            return (startDate <= date.getTime() && date.getTime() <= endDate);
        });
        return result;
    }
    descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }
    getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => this.descendingComparator(a, b, orderBy)
            : (a, b) => -this.descendingComparator(a, b, orderBy);
    }
    stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }    
} 
