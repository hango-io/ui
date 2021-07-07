const map = {
    DYNAMIC: '从注册中心同步',
    STATIC: '静态地址',
};

export default function publishType(val) {
    if (val) {
        return map[val];
    }
    return '-';
}
