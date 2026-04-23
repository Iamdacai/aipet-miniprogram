const { growthRecords, pets } = require('../../../utils/api');
const util = require('../../../utils/util');

Page({
  data: { petId: null, formData: { title: '', description: '', image: '' } },
  onLoad(options) {
    if (options.petId) this.setData({ petId: options.petId });
  },
  onInput(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({ [`formData.${field}`]: e.detail.value });
  },
  chooseImage() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        this.setData({ 'formData.image': res.tempFilePaths[0] });
        // 实际项目中需要上传到服务器
      }
    });
  },
  async onSubmit() {
    const { petId, formData } = this.data;
    if (!formData.title) { util.showError('请填写标题'); return; }
    try {
      util.showLoading('保存中...');
      const res = await growthRecords.create({ ...formData, petId });
      if (res.success) {
        util.showSuccess('保存成功');
        setTimeout(() => wx.navigateBack(), 500);
      } else util.showError(res.message);
    } catch (err) { util.showError('保存失败'); }
    util.hideLoading();
  }
});
