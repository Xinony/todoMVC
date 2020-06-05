let API_DOMAIN = '/'
export let LOGIN_URL = '/#/login'
if(process.env.NODE_ENV === 'production') {
    API_DOMAIN = '/'
    LOGIN_URL = '/#/login'
}

export const LOGIN_PAGE_URL = LOGIN_URL

// API请求正常，数据正常
export const API_CODE = {
    // API请求正常
    OK: '200',
    // API请求正常，数据异常
    ERR_DATA: '403',
    // API请求正常，空数据
    ERR_NO_DATA: '301',
    // API请求正常，登录异常
    ERR_LOGOUT: '401'
}
// API请求异常
export const API_FAILED = '网络连接异常，请稍后再试';
export const API_LOGOUT = '您的账号已在其他设备登录，请重新登录';


export const API_LIST = {
    // 用户登录
    USER_SIGNIN: API_DOMAIN + 'login',
    // 用户登出
    USER_SIGNOUT: API_DOMAIN + 'logout',
    //用户注册
    USER_SIGNUP: API_DOMAIN + 'regist',
    //检查apikey
    CHECK_APIKEY: API_DOMAIN + 'checkapikey',
    // 获取任务
    GET_TODO: API_DOMAIN + 'getTodo',
    // 添加任务
    ADD_TODO: API_DOMAIN + 'addTodo',
    // 修改任务状态--(未）完成
    CHANGE_TODO : API_DOMAIN + 'changeTodo',
    // 删除任务
    DELETE_TODO: API_DOMAIN + 'deleteTodo'
}



