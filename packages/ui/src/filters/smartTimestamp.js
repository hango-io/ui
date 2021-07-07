import moment from 'moment';

export default function smartTimestamp(val) {
    if (val) {
        return moment(val).format('YYYY-MM-DD HH:mm:ss');
    }
    return '-';
}
