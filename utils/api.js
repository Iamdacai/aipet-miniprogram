/**
 * API 接口封装
 */

const app = getApp();

/**
 * 用户认证相关
 */
const auth = {
  /**
   * 发送验证码
   */
  sendCode(phone) {
    return app.request({
      url: '/api/auth/send-code',
      method: 'POST',
      data: { phone },
      needAuth: false
    });
  },

  /**
   * 验证码登录
   */
  login(phone, code) {
    return app.request({
      url: '/api/auth/login',
      method: 'POST',
      data: { phone, code },
      needAuth: false
    });
  },

  /**
   * 获取用户信息
   */
  getProfile() {
    return app.request({
      url: '/api/auth/profile',
      method: 'GET'
    });
  }
};

/**
 * 宠物档案相关
 */
const pets = {
  /**
   * 获取宠物列表
   */
  getList(userId) {
    return app.request({
      url: '/api/pets',
      method: 'GET',
      data: { userId }
    });
  },

  /**
   * 获取宠物详情
   */
  getDetail(petId) {
    return app.request({
      url: `/api/pets/${petId}`,
      method: 'GET'
    });
  },

  /**
   * 创建宠物档案
   */
  create(data) {
    return app.request({
      url: '/api/pets',
      method: 'POST',
      data
    });
  },

  /**
   * 更新宠物档案
   */
  update(petId, data) {
    return app.request({
      url: `/api/pets/${petId}`,
      method: 'PUT',
      data
    });
  },

  /**
   * 删除宠物档案
   */
  delete(petId) {
    return app.request({
      url: `/api/pets/${petId}`,
      method: 'DELETE'
    });
  },

  /**
   * 获取品种列表
   */
  getBreeds(species) {
    return app.request({
      url: '/api/pets/breeds',
      method: 'GET',
      data: species ? { species } : {}
    });
  }
};

/**
 * 提醒管理相关
 */
const reminders = {
  /**
   * 获取提醒列表
   */
  getList(params = {}) {
    return app.request({
      url: '/api/reminders',
      method: 'GET',
      data: params
    });
  },

  /**
   * 创建提醒
   */
  create(data) {
    return app.request({
      url: '/api/reminders',
      method: 'POST',
      data
    });
  },

  /**
   * 更新提醒
   */
  update(reminderId, data) {
    return app.request({
      url: `/api/reminders/${reminderId}`,
      method: 'PUT',
      data
    });
  },

  /**
   * 删除提醒
   */
  delete(reminderId) {
    return app.request({
      url: `/api/reminders/${reminderId}`,
      method: 'DELETE'
    });
  },

  /**
   * 完成提醒
   */
  complete(reminderId) {
    return app.request({
      url: `/api/reminders/${reminderId}/complete`,
      method: 'POST'
    });
  }
};

/**
 * 知识库相关
 */
const articles = {
  /**
   * 获取文章列表
   */
  getList(params = {}) {
    return app.request({
      url: '/api/articles',
      method: 'GET',
      data: params
    });
  },

  /**
   * 获取文章详情
   */
  getDetail(articleId) {
    return app.request({
      url: `/api/articles/${articleId}`,
      method: 'GET'
    });
  },

  /**
   * 搜索文章
   */
  search(query, params = {}) {
    return app.request({
      url: '/api/articles/search',
      method: 'GET',
      data: { q: query, ...params }
    });
  },

  /**
   * 获取文章分类
   */
  getCategories() {
    return app.request({
      url: '/api/articles/categories',
      method: 'GET'
    });
  }
};

/**
 * 护理计划相关
 */
const carePlans = {
  /**
   * 获取护理计划列表
   */
  getList(params = {}) {
    return app.request({
      url: '/api/care-plans',
      method: 'GET',
      data: params
    });
  },

  /**
   * 获取护理计划详情
   */
  getDetail(planId) {
    return app.request({
      url: `/api/care-plans/${planId}`,
      method: 'GET'
    });
  },

  /**
   * 创建护理计划
   */
  create(data) {
    return app.request({
      url: '/api/care-plans',
      method: 'POST',
      data
    });
  },

  /**
   * 更新护理计划
   */
  update(planId, data) {
    return app.request({
      url: `/api/care-plans/${planId}`,
      method: 'PUT',
      data
    });
  },

  /**
   * 删除护理计划
   */
  delete(planId) {
    return app.request({
      url: `/api/care-plans/${planId}`,
      method: 'DELETE'
    });
  }
};

/**
 * 医院查询相关
 */
const hospitals = {
  /**
   * 获取医院列表
   */
  getList(params = {}) {
    return app.request({
      url: '/api/hospitals',
      method: 'GET',
      data: params
    });
  },

  /**
   * 获取医院详情
   */
  getDetail(hospitalId) {
    return app.request({
      url: `/api/hospitals/${hospitalId}`,
      method: 'GET'
    });
  }
};

/**
 * 成长记录相关
 */
const growthRecords = {
  /**
   * 获取成长记录列表
   */
  getList(petId) {
    return app.request({
      url: '/api/growth-records',
      method: 'GET',
      data: { petId }
    });
  },

  /**
   * 创建成长记录
   */
  create(data) {
    return app.request({
      url: '/api/growth-records',
      method: 'POST',
      data
    });
  },

  /**
   * 更新成长记录
   */
  update(recordId, data) {
    return app.request({
      url: `/api/growth-records/${recordId}`,
      method: 'PUT',
      data
    });
  },

  /**
   * 删除成长记录
   */
  delete(recordId) {
    return app.request({
      url: `/api/growth-records/${recordId}`,
      method: 'DELETE'
    });
  }
};

module.exports = {
  auth,
  pets,
  reminders,
  articles,
  carePlans,
  hospitals,
  growthRecords
};
