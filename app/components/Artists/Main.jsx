"use strict";
var React = require('react');
var Reflux = require('reflux');
var classNames = require('classnames');
var Reflux = require('reflux');
var ArtistList = require('./List.jsx');
var ArtistStore = require('../../stores/ArtistListStore');
var CountryStore = require('../../stores/CountryStore');
var ArtistActions = require('../../actions/ArtistActions');
var Pager = require('../Common/Pager.jsx');
var ListSearch = require('../Common/ListSearch.jsx');
var Role = require('../Common/Role.jsx');

/**
 * 右侧过滤
 */
var CountriesFilter = React.createClass({
  mixins: [Reflux.connect(CountryStore, 'countries')],
  propTypes: {
    buttonShowTitle: React.PropTypes.string, //按钮显示文字
    buttonHideTitle: React.PropTypes.string, // 按钮影藏文字
    title: React.PropTypes.string, // 标题栏文字
    show: React.PropTypes.bool,
    onItemClick: React.PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      title: '国籍筛选',
      buttonShowTitle: '国籍选取',
      buttonHideTitle: '隐藏筛选面板'
    }
  },

  getInitialState: function() {
    return {
      show: false
    };
  },

  /**
     * 处理按钮点击事件
     * @param e
     */
  handleClick: function(e) {
    e.preventDefault();
    this.setState({
      show: !this.state.show
    });
  },

  /**
     * 处理当前的事件
     * @param e
     */
  handleItemClick: function(e) {
    e.preventDefault();
    //this.setState({show:false});
    this.props.onItemClick(e);
  },

  /**
     * 显示国籍界面
     * @returns {XML}
     */
  renderCountries: function() {
    var self = this;
    return (
      <div className="list-group">
        <a className="list-group-item" style={{
          padding: "8px 8px"
        }} key={'全部'} onClick={self.handleItemClick}>
          全部
        </a>
        {this.state.countries.map(function (item) {
            return (
              <a className="list-group-item" style={{
                padding: "8px 8px"
              }} key={item.term} data-name={item.term} onClick={self.handleItemClick}>
                <span className="badge">共有{item.count}位艺人</span>
                {item.term}
              </a>
            );
          })}
      </div>
    )
  },

  render: function() {

    var buttonTitle = this.state.show
      ? this.props.buttonHideTitle
      : this.props.buttonShowTitle;
    var classes = classNames('filter-box', {
      'in': this.state.show
    });
    return (
      <span>
        <button onClick={this.handleClick} className="btn btn-default btn-sm">
          <span className="fa fa-bars"></span>
          {buttonTitle}</button>
        <div className={classes}>
          <div className='filter-box-header'>
            <h1>{this.props.title}
              <span className="fa fa-times" aria-hidden="true" onClick={this.handleClick} style={{
                float: 'right'
              }}></span>
            </h1>
          </div>
          <div className='filter-box-body'>
            {this.renderCountries()}
          </div>
        </div>
      </span>
    );
  }
});

// 无分页
var Main = React.createClass({
  mixins: [Reflux.connect(ArtistStore, 'artists')],

  contextTypes: {
    location: React.PropTypes.object,
    history: React.PropTypes.object,
  },

  componentDidMount: function() {
    console.log(this)
    var params = this.context.location.query;
    params.size = this.props.size;
    ArtistActions.find(params);
  },

  getDefaultProps: function() {
    return {
      size: 1000
    };
  },

  handleShowDetailAction: function(e) {
    var id = e.target.getAttribute('data-id');
    this.context.history.pushState(null, `/artists/${id}`, {});
  },

  handleSearch: function() {
    var params = {
      q: this._searchBar.value
    };
    this.context.history.pushState(null, `/artists`, params);
    ArtistActions.find(params);
  },

  handleRedirectNew: function() {
    this.context.history.pushState(null, `/artists/new`, {});
  },

  render: function() {
    return (
      <div className='list-wrap'>
        <ListSearch ref={ _ => this._searchBar = _} placeholder={window.lang.serachArtist} handleSearch={this.handleSearch}/>
        <div className='has-top-bar'>
          <div className='btn-group'>
            <Role component='button' roleName='ADMIN' onClick={this.handleRedirectNew} className="btn btn-default">{window.lang.add_ar}</Role>
          </div>
          <ArtistList items={this.state.artists.items} loaded={this.state.artists.loaded} onShowDetailAction={this.handleShowDetailAction}/>
        </div>
      </div>
    );
  }
});

module.exports = Main;
