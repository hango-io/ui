// 应用名称-处理后端返回数据
const projectIsolationRegex = /^.+\.nsf\..+\.(eureka|nacos)$/;
const registryRegex = /^.+\.(eureka|nacos|dubbo)$/;
const handleApplicationName = function(val) {
    if (!val) return '-';
    let res = val;
    const tempVal = val;
    const arr = tempVal.split('.');
    const l = arr.length;
    if (projectIsolationRegex.test(tempVal)) {
        // 格式化服务名，去除项目隔离信息
        res = arr.splice(0, l - 3).join('.');
    } else if (registryRegex.test(tempVal)) {
        // 格式化服务名，去除服务后缀
        res = arr.splice(0, l - 1).join('.');
    }
    return res;
};

export default handleApplicationName;
