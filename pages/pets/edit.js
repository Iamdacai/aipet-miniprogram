/**
 * 宠物编辑页面
 */

const { pets } = require('../../../utils/api');
const util = require('../../../utils/util');

Page({
  data: {
    isEdit: false,
    petId: null,
    canSubmit: false,
    speciesIndex: 0,
    speciesOptions: [
      { value: 'dog', label: '狗' },
      { value: 'cat', label: '猫' },
      { value: 'bird', label: '鸟' },
      { value: 'rabbit', label: '兔子' },
      { value: 'hamster', label: '仓鼠' },
      { value: 'other', label: '其他' }
    ],
    avatarOptions: ['🐕', '🐈', '🐩', '🦮', '🐕‍🦺', '🐱', '🐈‍⬛', '🐇', '🐹', '🐦', '🦜'],
    formData: {
      name: '',
      species: 'dog',
      breed: '',
      gender: 'male',
      age: '',
      weight: '',
      birthday: '',
      color: '',
      avatar: '🐕',
      healthInfo: {
        vaccinated: false,
        neutered: false,
        allergies: '',
        notes: ''
      }
    }
  },

  onLoad(options) {
    const { id } = options;
    
    if (id) {
      // 编辑模式
      this.setData({ isEdit: true, petId: id });
      wx.setNavigationBarTitle({ title: '编辑宠物' });
      this.loadPetData(id);
    }
  },

  /**
   * 加载宠物数据（编辑模式）
   */
  async loadPetData(petId) {
    try {
      util.showLoading('加载中...');
      
      const res = await pets.getDetail(petId);
      
      if (res.success && res.data) {
        const pet = res.data;
        const speciesIndex = this.data.speciesOptions.findIndex(s => s.value === pet.species);
        
        this.setData({
          speciesIndex: speciesIndex >= 0 ? speciesIndex : 0,
          formData: {
            name: pet.name || '',
            species: pet.species || 'dog',
            breed: pet.breed || '',
            gender: pet.gender || 'male',
            age: pet.age?.toString() || '',
            weight: pet.weight?.toString() || '',
            birthday: pet.birthday || '',
            color: pet.color || '',
            avatar: pet.avatar || '🐕',
            healthInfo: {
              vaccinated: pet.healthInfo?.vaccinated || false,
              neutered: pet.healthInfo?.neutered || false,
              allergies: pet.healthInfo?.allergies || '',
              notes: pet.healthInfo?.notes || ''
            }
          },
          canSubmit: this.checkCanSubmit()
        });
      } else {
        util.showError(res.message || '加载失败');
      }
    } catch (err) {
      console.error('加载宠物数据失败', err);
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
   * 健康信息输入
   */
  onHealthInput(e) {
    const { field } = e.currentTarget.dataset;
    const value = e.detail.value;
    
    this.setData({
      [`formData.healthInfo.${field}`]: value
    });
  },

  /**
   * 物种选择
   */
  onSpeciesChange(e) {
    const index = e.detail.value;
    const species = this.data.speciesOptions[index].value;
    
    this.setData({
      speciesIndex: index,
      'formData.species': species
    });
  },

  /**
   * 性别选择
   */
  onGenderChange(e) {
    const { gender } = e.currentTarget.dataset;
    this.setData({
      'formData.gender': gender
    });
  },

  /**
   * 生日选择
   */
  onBirthdayChange(e) {
    const birthday = e.detail.value;
    this.setData({
      'formData.birthday': birthday
    });
  },

  /**
   * 选择头像
   */
  selectAvatar(e) {
    const { avatar } = e.currentTarget.dataset;
    this.setData({
      'formData.avatar': avatar
    });
  },

  /**
   * 切换复选框
   */
  toggleCheckbox(e) {
    const { field } = e.currentTarget.dataset;
    const currentValue = this.data.formData.healthInfo[field];
    
    this.setData({
      [`formData.healthInfo.${field}`]: !currentValue
    });
  },

  /**
   * 检查是否可以提交
   */
  checkCanSubmit() {
    const { name, breed, age } = this.data.formData;
    return !!(name && breed && age);
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
      
      const { petId, formData } = this.data;
      const submitData = {
        ...formData,
        age: parseInt(formData.age),
        weight: formData.weight ? parseFloat(formData.weight) : null
      };

      let res;
      if (this.data.isEdit) {
        res = await pets.update(petId, submitData);
      } else {
        res = await pets.create(submitData);
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
