/**
 * 文章列表页面
 */

const { articles } = require('../../../utils/api');
const util = require('../../../utils/util');

Page({
  data: {
    searchQuery: '',
    currentCategory: '',
    articles: [],
    page: 1,
    hasMore: true,
    loading: false
  },

  onLoad() {
    this.loadArticles();
  },

  onPullDownRefresh() {
    this.setData({ page: 1, articles: [], hasMore: true }, () => {
      this.loadArticles().then(() => {
        wx.stopPullDownRefresh();
      });
    });
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMore();
    }
  },

  /**
   * 加载文章
   */
  async loadArticles() {
    try {
      this.setData({ loading: true });
      
      const { page, currentCategory, searchQuery } = this.data;
      const params = {
        page,
        limit: 10
      };
      
      if (currentCategory) {
        params.category = currentCategory;
      }
      
      if (searchQuery) {
        const res = await articles.search(searchQuery, params);
        this.handleResponse(res);
      } else {
        const res = await articles.getList(params);
        this.handleResponse(res);
      }
    } catch (err) {
      console.error('加载文章失败', err);
      util.showError('加载失败');
    } finally {
      this.setData({ loading: false });
    }
  },

  /**
   * 处理响应
   */
  handleResponse(res) {
    if (res.success) {
      const newArticles = (res.data || []).map(a => ({
        ...a,
        createdAt: util.formatDate(new Date(a.createdAt))
      }));
      
      const { page, articles } = this.data;
      const updatedArticles = page === 1 ? newArticles : [...articles, ...newArticles];
      
      this.setData({
        articles: updatedArticles,
        hasMore: newArticles.length === 10
      });
    }
  },

  /**
   * 加载更多
   */
  loadMore() {
    this.setData({ page: this.data.page + 1 }, () => {
      this.loadArticles();
    });
  },

  /**
   * 输入搜索词
   */
  onSearchInput(e) {
    this.setData({
      searchQuery: e.detail.value
    });
  },

  /**
   * 搜索
   */
  onSearch() {
    this.setData({ page: 1, articles: [], hasMore: true }, () => {
      this.loadArticles();
    });
  },

  /**
   * 选择分类
   */
  selectCategory(e) {
    const { category } = e.currentTarget.dataset;
    this.setData({
      currentCategory: category,
      page: 1,
      articles: [],
      hasMore: true
    }, () => {
      this.loadArticles();
    });
  },

  /**
   * 跳转详情
   */
  goToDetail(e) {
    const { articleId } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/articles/detail?id=${articleId}`
    });
  }
});
