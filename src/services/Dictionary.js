
class Dictionary {
    static translate(key) {
        const dict = {
            'cash': 'เงินสด',
            'credit': 'เงินเชื่อ',
            'credit_card': 'บัตรเครดิต',
            'kg': 'กิโลกรัม',
            'pcs': 'ชิ้น'
        };

        return dict[key] ?? key;
    }
}

export default Dictionary;
