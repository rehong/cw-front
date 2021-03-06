var axios = require('axios');
var APIHelper = require('./APIHelper').APIHelper;
module.exports = {

  /**
   * 查询专辑列表
   * @param  {Object} params {page: 1, size: 5}
   * @returns {axios.Promise}
   */
  find: function(params) {
    return axios({
      url: APIHelper.getPrefix() + '/albums',
      responseType: 'json',
      params: params,
      withCredentials: true
    });
  },

  search: function(params) {
    return axios({
      url: APIHelper.getPrefix() + '/albums/search',
      responseType: 'json',
      params: params,
      withCredentials: true
    });
  },

  /**
   * 查询专辑详情
   * @param  {Number} id 专辑ID
   * @return {axios.Promise}
   */
  get: function(id) {
    return axios.get(APIHelper.getPrefix() + '/albums/' + id, {
      withCredentials: true
    });
  },


  /**
   * 更新专辑信息
   * @param  {Number} id         专辑ID
   * @param  {Object} attributes 更新的信息
   * @return {axios.Promise}
   */
  update: function(id, attributes) {
    return axios({
      url: APIHelper.getPrefix() + '/albums/' + id,
      data: attributes,
      method: 'PUT',
      withCredentials: true
    });
  },

  /**
   * 新建专辑
   * @param  {Object} album
   * @return {axios.Promise}
   */
  create: function(album) {
    return axios({
      url: APIHelper.getPrefix() + '/albums',
      data: album,
      method: 'POST',
      withCredentials: true
    });
  },
  build: function(publishers){
    return axios({
      method: 'POST',
      url: APIHelper.getPrefix() + '/albums/mappings/',
      data: publishers,
      withCredentials: true
    });
  }

};
