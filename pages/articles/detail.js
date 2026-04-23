/**
 * 文章详情页面
 */

const { articles } = require('../../../utils/api');
const util = require('../../../utils/util');

Page({
  data: {
    articleId: null,
    article: null
  },

  onLoad(options) {
    const { id } = options;
    if (id) {
      this.setData({ articleId: id });
      this.loadArticle(id);
    }
  },

  /**
   * 加载文章详情
   */
  async loadArticle(articleId) {
    try {
      const res = await articles.getDetail(articleId);
      
      if (res.success && res.data) {
        const article = res.data;
        this.setData({
          article: {
            ...article,
            createdAt: util.formatDate(new Date(article.createdAt)),
            content: article.content || article.summary
          }
        });
        
        wx.setNavigationBarTitle({
          title: article.title.slice(0, 10)
        });
      }
    } catch (err) {
      console.error('加载文章失败', err);
    }
  }
});
