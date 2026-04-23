/**
 * Ai 宠 - 微信小程序
 * 宠物健康管理平台
 */

App({
  globalData: {
    // API 配置
    apiBaseUrl: 'https://caiyuyang.cn',
    
    // 用户信息
    userInfo: null,
    token: null,
    userId: null,
    
    // 当前选择的宠物
    currentPetId: null
  },

  onLaunch() {
    console.log('Ai 宠小程序启动');
    
    // 从本地存储加载用户信息
    this.loadUserInfo();
    
    // 检查登录状态
    this.checkLoginStatus();
  },

  /**
   * 从本地存储加载用户信息
   */
  loadUserInfo() {
    try {
      const token = wx.getStorageSync('token');
      const userInfo = wx.getStorageSync('userInfo');
      
      if (token) {
        this.globalData.token = token;
      }
      
      if (userInfo) {
        this.globalData.userInfo = userInfo;
        this.globalData.userId = userInfo.id;
      }
    } catch (e) {
      console.error('加载用户信息失败', e);
    }
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus() {
    if (!this.globalData.token) {
      // 未登录，跳转到登录页（但不在 onLaunch 中强制跳转，避免影响体验）
      console.log('用户未登录');
    }
  },

  /**
   * 保存用户信息到本地存储
   */
  saveUserInfo(token, userInfo) {
    try {
      this.globalData.token = token;
      this.globalData.userInfo = userInfo;
      this.globalData.userId = userInfo.id;
      
      wx.setStorageSync('token', token);
      wx.setStorageSync('userInfo', userInfo);
    } catch (e) {
      console.error('保存用户信息失败', e);
    }
  },

  /**
   * 清除用户信息
   */
  clearUserInfo() {
    try {
      this.globalData.token = null;
      this.globalData.userInfo = null;
      this.globalData.userId = null;
      
      wx.removeStorageSync('token');
      wx.removeStorageSync('userInfo');
    } catch (e) {
      console.error('清除用户信息失败', e);
    }
  },

  /**
   * 发起网络请求（封装 wx.request）
   */
  request(options) {
    const { url, method = 'GET', data = {}, needAuth = true } = options;
    
    return new Promise((resolve, reject) => {
      const header = {
        'Content-Type': 'application/json'
      };
      
      // 添加认证 token
      if (needAuth && this.globalData.token) {
        header['Authorization'] = `Bearer ${this.globalData.token}`;
      }
      
      wx.request({
        url: `${this.globalData.apiBaseUrl}${url}`,
        method,
        data,
        header,
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data);
          } else if (res.statusCode === 401) {
            // 登录过期
            wx.showToast({
              title: '登录已过期',
              icon: 'none'
            });
            this.clearUserInfo();
            // 跳转到登录页
            wx.reLaunch({ url: '/pages/login/login' });
            reject(new Error('登录已过期'));
          } else {
            reject(new Error(res.data?.message || '请求失败'));
          }
        },
        fail: (err) => {
          console.error('请求失败', err);
          wx.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
          reject(err);
        }
      });
    });
  }
});
