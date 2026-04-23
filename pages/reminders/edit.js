/**
 * 提醒编辑页面
 */

const { reminders, pets } = require('../../../utils/api');
const util = require('../../../utils/util');

Page({
  data: {
    isEdit: false,
    reminderId: null,
    canSubmit: false,
    petIndex: -1,
    repeatIndex: 0,
    repeatOptions: ['不重复', '每天', '每周', '每月'],
    pets: [],
    formData: {
      type: 'feed',
      title: '',
      petId: null,
      date: '',
      time: '',
      repeat: 'none',
      notes: ''
    }
  },

  onLoad(options) {
    const { id } = options;
    
    this.loadPets();
    
    if (id) {
      // 编辑模式
      this.setData({ isEdit: true, reminderId: id });
      wx.setNavigationBarTitle({ title: '编辑提醒' });
      this.loadReminderData(id);
    }
  },

  /**
   * 加载宠物列表
   */
  async loadPets() {
    const app = getApp();
    const userId = app.globalData.userId;

    if (!userId) return;

    try {
      const res = await pets.getList(userId);
      
      if (res.success && res.data) {
        this.setData({
          pets: res.data,
          // 添加"不选择"选项
          'pets[0]': { id: null, name: '不选择' }
        });
      }
    } catch (err) {
      console.error('加载宠物列表失败', err);
    }
  },

  /**
   * 加载提醒数据（编辑模式）
   */
  async loadReminderData(reminderId) {
    try {
      util.showLoading('加载中...');
      
      const res = await reminders.getList({});
      
      if (res.success && res.data) {
        const reminder = res.data.find(r => r.id === reminderId);
        
        if (reminder) {
          const remindAt = new Date(reminder.remindAt);
          const date = util.formatDate(remindAt);
          const time = util.formatDateTime(remindAt).split(' ')[1].slice(0, 5);
          
          // 查找对应的宠物索引
          let petIndex = -1;
          if (reminder.petId) {
            petIndex = this.data.pets.findIndex(p => p.id === reminder.petId);
          }
          
          // 重复选项映射
          const repeatMap = {
            'none': 0,
            'daily': 1,
            'weekly': 2,
            'monthly': 3
          };
          const repeatIndex = repeatMap[reminder.repeat] || 0;
          
          this.setData({
            petIndex,
            repeatIndex,
            formData: {
              type: reminder.type || 'feed',
              title: reminder.title || '',
              petId: reminder.petId,
              date: date,
              time: time,
              repeat: reminder.repeat || 'none',
              notes: reminder.notes || ''
            },
            canSubmit: this.checkCanSubmit()
          });
        }
      }
    } catch (err) {
      console.error('加载提醒数据失败', err);
      util.showError('加载失败');
    } finally {
      util.hideLoading();
    }
  },

  /**
   * 输入事件
   */
  onInput(e) {
    const { field } = e.currentTarget.dataset;
    const value = e.detail.value;
    
    this.setData({
      [`formData.${field}`]: value,
      canSubmit: this.checkCanSubmit()
    });
  },

  /**
   * 选择类型
   */
  selectType(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({
      'formData.type': type
    });
  },

  /**
   * 选择宠物
   */
  onPetChange(e) {
    const index = e.detail.value;
    const pet = this.data.pets[index];
    
    this.setData({
      petIndex: index,
      'formData.petId': pet ? pet.id : null
    });
  },

  /**
   * 选择日期
   */
  onDateChange(e) {
    const date = e.detail.value;
    this.setData({
      'formData.date': date,
      canSubmit: this.checkCanSubmit()
    });
  },

  /**
   * 选择时间
   */
  onTimeChange(e) {
    const time = e.detail.value;
    this.setData({
      'formData.time': time,
      canSubmit: this.checkCanSubmit()
    });
  },

  /**
   * 选择重复
   */
  onRepeatChange(e) {
    const index = e.detail.value;
    const repeatMap = ['none', 'daily', 'weekly', 'monthly'];
    
    this.setData({
      repeatIndex: index,
      'formData.repeat': repeatMap[index]
    });
  },

  /**
   * 检查是否可以提交
   */
  checkCanSubmit() {
    const { title, date, time } = this.data.formData;
    return !!(title && date && time);
  },

  /**
   * 提交表单
   */
  async onSubmit() {
    if (!this.checkCanSubmit()) {
      util.showError('请填写必填项');
      return;
    }

    try {
      util.showLoading(this.data.isEdit ? '保存中...' : '添加中...');
      
      const { reminderId, formData } = this.data;
      
      // 组合日期时间
      const remindAt = new Date(`${formData.date}T${formData.time}:00`);
      
      const submitData = {
        title: formData.title,
        type: formData.type,
        petId: formData.petId,
        remindAt: remindAt.toISOString(),
        repeat: formData.repeat,
        notes: formData.notes,
        completed: false
      };

      let res;
      if (this.data.isEdit) {
        res = await reminders.update(reminderId, submitData);
      } else {
        res = await reminders.create(submitData);
      }
      
      if (res.success) {
        util.showSuccess(this.data.isEdit ? '保存成功' : '添加成功');
        setTimeout(() => {
          wx.navigateBack();
        }, 500);
      } else {
        util.showError(res.message || '操作失败');
      }
    } catch (err) {
      console.error('提交失败', err);
      util.showError('操作失败，请稍后重试');
    } finally {
      util.hideLoading();
    }
  }
});
