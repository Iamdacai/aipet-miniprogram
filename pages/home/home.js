/**
 * 首页
 */

const { pets, reminders, articles } = require('../../utils/api');
const util = require('../../utils/util');

Page({
  data: {
    userInfo: null,
    greetingText: '早上好',
    weather: null,
    pets: [],
    todayReminders: [],
    articles: []
  },

  onLoad() {
    this.updateGreeting();
    this.loadData();
  },

  onShow() {
    // 每次显示时刷新数据
    this.loadData();
  },

  /**
   * 更新问候语
   */
  updateGreeting() {
    const hour = new Date().getHours();
    let greeting = '晚上好';
    
    if (hour >= 5 && hour < 12) {
      greeting = '早上好';
    } else if (hour >= 12 && hour < 14) {
      greeting = '中午好';
    } else if (hour >= 14 && hour < 18) {
      greeting = '下午好';
    } else if (hour >= 18 && hour < 23) {
      greeting = '晚上好';
    }
    
    this.setData({ greetingText: greeting });
  },

  /**
   * 加载数据
   */
  async loadData() {
    const app = getApp();
    const userId = app.globalData.userId;
    
    if (!userId) {
      // 未登录，跳转到登录页
      wx.reLaunch({ url: '/pages/login/login' });
      return;
    }

    // 加载用户信息
    const userInfo = app.globalData.userInfo;
    this.setData({ userInfo });

    try {
      // 并行加载数据
      const [petsRes, remindersRes, articlesRes] = await Promise.all([
        pets.getList(userId),
        reminders.getList({ userId, completed: false }),
        articles.getList({ limit: 3 })
      ]);

      // 处理宠物数据
      const petsList = petsRes.success ? petsRes.data || [] : [];
      
      // 处理提醒数据 - 筛选今日提醒
      const today = new Date().toDateString();
      const todayReminders = (remindersRes.success ? remindersRes.data || [] : [])
        .filter(r => new Date(r.remindAt).toDateString() === today)
        .slice(0, 5);

      // 处理文章数据
      const articlesList = (articlesRes.success ? articlesRes.data || [] : [])
        .map(a => ({
          ...a,
          createdAt: util.formatDate(new Date(a.createdAt))
        }));

      this.setData({
        pets: petsList,
        todayReminders,
        articles: articlesList
      });
    } catch (err) {
      console.error('加载数据失败', err);
      util.showError('加载数据失败');
    }
  },

  /**
   * 跳转页面
   */
  goToPage(e) {
    const { url } = e.currentTarget.dataset;
    wx.navigateTo({ url });
  },

  /**
   * 跳转宠物详情
   */
  goToPetDetail(e) {
    const { petId } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/pets/detail?id=${petId}`
    });
  },

  /**
   * 跳转文章详情
   */
  goToArticleDetail(e) {
    const { articleId } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/articles/detail?id=${articleId}`
    });
  }
});
