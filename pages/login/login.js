/**
 * 登录页面
 */

const { auth } = require('../../utils/api');
const util = require('../../utils/util');

Page({
  data: {
    phone: '',
    code: '',
    countdown: 0,
    canSendCode: true,
    canLogin: false
  },

  onLoad() {
    // 检查是否已登录
    const app = getApp();
    if (app.globalData.token) {
      wx.reLaunch({ url: '/pages/home/home' });
    }
  },

  /**
   * 手机号输入
   */
  onPhoneInput(e) {
    const phone = e.detail.value;
    this.setData({
      phone,
      canLogin: this.checkCanLogin()
    });
  },

  /**
   * 验证码输入
   */
  onCodeInput(e) {
    const code = e.detail.value;
    this.setData({
      code,
      canLogin: this.checkCanLogin()
    });
  },

  /**
   * 检查是否可以登录
   */
  checkCanLogin() {
    const { phone, code } = this.data;
    return util.validatePhone(phone) && util.validateCode(code);
  },

  /**
   * 发送验证码
   */
  async sendCode() {
    const { phone, countdown } = this.data;
    
    if (countdown > 0) return;
    
    if (!util.validatePhone(phone)) {
      util.showError('请输入正确的手机号');
      return;
    }

    try {
      util.showLoading('发送中...');
      
      const res = await auth.sendCode(phone);
      
      if (res.success) {
        util.showSuccess('验证码已发送');
        this.startCountdown();
      } else {
        util.showError(res.message || '发送失败');
      }
    } catch (err) {
      console.error('发送验证码失败', err);
      util.showError('发送失败，请稍后重试');
    } finally {
      util.hideLoading();
    }
  },

  /**
   * 开始倒计时
   */
  startCountdown() {
    this.setData({ countdown: 60, canSendCode: false });
    
    const timer = setInterval(() => {
      const { countdown } = this.data;
      
      if (countdown <= 1) {
        clearInterval(timer);
        this.setData({ countdown: 0, canSendCode: true });
      } else {
        this.setData({ countdown: countdown - 1 });
      }
    }, 1000);
  },

  /**
   * 登录
   */
  async login() {
    const { phone, code } = this.data;
    
    if (!this.checkCanLogin()) {
      util.showError('请输入完整的手机号和验证码');
      return;
    }

    try {
      util.showLoading('登录中...');
      
      const res = await auth.login(phone, code);
      
      if (res.success && res.data) {
        const { token, user } = res.data;
        
        // 保存用户信息
        const app = getApp();
        app.saveUserInfo(token, user);
        
        util.showSuccess('登录成功');
        
        // 跳转到首页
        setTimeout(() => {
          wx.reLaunch({ url: '/pages/home/home' });
        }, 500);
      } else {
        util.showError(res.message || '登录失败');
      }
    } catch (err) {
      console.error('登录失败', err);
      util.showError('登录失败，请稍后重试');
    } finally {
      util.hideLoading();
    }
  },

  /**
   * 显示协议
   */
  showAgreement() {
    wx.showModal({
      title: '用户协议与隐私政策',
      content: '感谢您使用 Ai 宠！\n\n我们非常重视您的隐私保护。在使用本产品前，请仔细阅读并同意我们的用户协议和隐私政策。\n\n我们将严格按照法律法规保护您的个人信息，仅用于提供宠物健康管理服务。',
      showCancel: false,
      confirmText: '我已知晓'
    });
  }
});
