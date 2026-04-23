/**
 * 提醒列表页面
 */

const { reminders, pets } = require('../../../utils/api');
const util = require('../../../utils/util');

Page({
  data: {
    currentTab: 0, // 0: 全部，1: 未完成，2: 已完成
    reminders: [],
    groupedReminders: [],
    loading: false,
    petMap: {}
  },

  onLoad() {
    this.loadReminders();
    this.loadPets();
  },

  onShow() {
    // 每次显示时刷新数据
    this.loadReminders();
  },

  onPullDownRefresh() {
    this.loadReminders().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 加载宠物列表（用于显示宠物名称）
   */
  async loadPets() {
    const app = getApp();
    const userId = app.globalData.userId;

    try {
      const res = await pets.getList(userId);
      
      if (res.success && res.data) {
        const petMap = {};
        res.data.forEach(pet => {
          petMap[pet.id] = pet.name;
        });
        
        this.setData({ petMap });
      }
    } catch (err) {
      console.error('加载宠物列表失败', err);
    }
  },

  /**
   * 加载提醒列表
   */
  async loadReminders() {
    const app = getApp();
    const userId = app.globalData.userId;

    if (!userId) {
      wx.reLaunch({ url: '/pages/login/login' });
      return;
    }

    try {
      this.setData({ loading: true });
      
      const { currentTab } = this.data;
      const params = { userId };
      
      // 根据 tab 筛选
      if (currentTab === 1) {
        params.completed = false;
      } else if (currentTab === 2) {
        params.completed = true;
      }

      const res = await reminders.getList(params);
      
      if (res.success) {
        const remindersList = res.data || [];
        
        // 按日期分组
        const grouped = this.groupByDate(remindersList);
        
        this.setData({
          reminders: remindersList,
          groupedReminders: grouped,
          loading: false
        });
      } else {
        util.showError(res.message || '加载失败');
        this.setData({ loading: false });
      }
    } catch (err) {
      console.error('加载提醒列表失败', err);
      util.showError('加载失败，请稍后重试');
      this.setData({ loading: false });
    }
  },

  /**
   * 按日期分组
   */
  groupByDate(reminders) {
    const groups = {};
    
    reminders.forEach(reminder => {
      const date = new Date(reminder.remindAt);
      const dateStr = this.formatDateGroup(date);
      
      if (!groups[dateStr]) {
        groups[dateStr] = {
          date: dateStr,
          reminders: []
        };
      }
      
      groups[dateStr].reminders.push({
        ...reminder,
        time: util.formatDateTime(date).split(' ')[1].slice(0, 5),
        petName: this.data.petMap[reminder.petId] || ''
      });
    });
    
    // 按日期排序
    return Object.values(groups).sort((a, b) => {
      return new Date(a.reminders[0].remindAt) - new Date(b.reminders[0].remindAt);
    });
  },

  /**
   * 格式化日期分组
   */
  formatDateGroup(date) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
    
    if (dateOnly.getTime() === todayOnly.getTime()) {
      return '今天';
    } else if (dateOnly.getTime() === tomorrowOnly.getTime()) {
      return '明天';
    } else {
      return util.formatDate(date);
    }
  },

  /**
   * 切换 tab
   */
  switchTab(e) {
    const { tab } = e.currentTarget.dataset;
    this.setData({
      currentTab: parseInt(tab)
    }, () => {
      this.loadReminders();
    });
  },

  /**
   * 切换完成状态
   */
  async toggleComplete(e) {
    const { reminderId, completed } = e.currentTarget.dataset;
    
    try {
      const res = completed 
        ? await reminders.update(reminderId, { completed: false })
        : await reminders.complete(reminderId);
      
      if (res.success) {
        // 重新加载列表
        await this.loadReminders();
        util.showSuccess(completed ? '已取消完成' : '已完成');
      } else {
        util.showError(res.message || '操作失败');
      }
    } catch (err) {
      console.error('切换完成状态失败', err);
      util.showError('操作失败，请稍后重试');
    }
  },

  /**
   * 跳转编辑页面
   */
  goToEdit(e) {
    const { reminderId } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/reminders/edit?id=${reminderId}`
    });
  },

  /**
   * 添加提醒
   */
  goToAdd() {
    wx.navigateTo({
      url: '/pages/reminders/edit'
    });
  }
});
