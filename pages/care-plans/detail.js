const { carePlans, pets } = require('../../../utils/api');
const util = require('../../../utils/util');

Page({
  data: { plan: null },
  onLoad(options) {
    if (options.id) this.loadPlan(options.id);
  },
  async loadPlan(planId) {
    try {
      const res = await carePlans.getDetail(planId);
      if (res.success && res.data) {
        const plan = res.data;
        let petName = '';
        if (plan.petId) {
          const petRes = await pets.getList(getApp().globalData.userId);
          const pet = petRes.data?.find(p => p.id === plan.petId);
          petName = pet ? pet.name : '';
        }
        this.setData({
          plan: {
            ...plan,
            startDate: util.formatDate(new Date(plan.startDate)),
            endDate: util.formatDate(new Date(plan.endDate)),
            petName
          }
        });
      }
    } catch (err) { console.error(err); }
  }
});
