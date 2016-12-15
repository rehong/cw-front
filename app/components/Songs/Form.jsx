'use strict';
var React = require('react');
var Assist = require('../Common/Assist.jsx');
var dbg = require('debug')('topdmc:Song/Form');
var ArtistMiniCard = require('../Artists/MiniCard.jsx');
var AlbumMiniCard = require('../Albums/MiniCard.jsx');

var AddCardTips = require('../Common/AddCardTips.jsx');
var assign = require('object-assign');
var classNames = require('classnames');
var _ = require('lodash');
var APIHelper = require('app/utils/APIHelper').APIHelper;
var axios = require('axios');

var Role = require('app/components/Common/Role.jsx');

var TextareaAutosize = require('../Common/TextareaAutosize.jsx');

var Mp3Uploader = require('app/components/Common/Mp3Uploader.jsx');

var Dialog = require('rc-dialog');
var List = require('./Dsps/List.jsx');
var mydata = require('./Dsps/DefaultData.jsx');
var SongActions = require('../../actions/SongActions');
var Form = React.createClass({

  getInitialState: function() {
    var defaultState = assign({
      isDropArtistActive: false,
      isDropAlbumActive: false,
      SearchBoxType: 'Artist',
      lrc: '',
      visible: false,
      destroyOnClose: false,
      checked: false,
    }, this.props.data);
    return defaultState;
  },

  componentDidMount: function() {
    this.isDropArtistActiveState = false;
    this.isDropAlbumActiveState = false;
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps.data);
  },

  // 弹窗相关事件处理
  onClick(e) {
    this.setState({
      mousePosition: {
        x: e.pageX,
        y: e.pageY,
      },
      visible: true,
    });
  },

  onClose() {
    this.state.visible=false;
    this.setState(this.state)
  },

  onDestroyOnCloseChange(e) {
    this.setState({
      destroyOnClose: e.target.checked,
    });
  },

  // 拖拽相关事件处理
  // --------------------------------------------
  handleDrop: function(evt) {
    evt.preventDefault();

    var card;

    try {
      card = JSON.parse(evt.dataTransfer.getData('data'));
    } catch (e) {
      return;
    }

    this.handleItemClick(card);
    var type = card.type;
    if (type === 'Album') {
      this.isDropAlbumActiveState = false;
      this.state.isDropAlbumActive = false;
      this.setState(this.state);
    }
    if (type === 'Artist') {
      this.isDropArtistActiveState = false;
      this.state.isDropArtistActive = false;
      this.setState(this.state);
    }
  },

  allowAlbumDrop: function(evt) {
    evt.preventDefault();
    this.state.isDropAlbumActive = true;
    if (this.isDropAlbumActiveState) return;
    this.setState(this.state);
    this.isDropAlbumActiveState = true;
  },

  allowArtistDrop: function(evt) {
    evt.preventDefault();
    this.state.isDropArtistActive = true;
    if (this.isDropArtistActiveState) return;
    this.setState(this.state);
    this.isDropArtistActiveState = true;
  },

  handleDragAlbumEnter: function(evt) {
    evt.preventDefault();
    this.state.isDropAlbumActive = true;
    this.setState(this.state);
  },

  handleDragArtistEnter: function(evt) {
    evt.preventDefault();
    this.state.isDropArtistActive = true;
    this.setState(this.state);
  },

  handleDragAlbumLeave: function(evt) {
    evt.preventDefault();
    this.isDropAlbumActiveState = false;
    this.state.isDropAlbumActive = false;
    this.setState(this.state);
  },

  handleDragArtistLeave: function(evt) {
    evt.preventDefault();
    this.isDropArtistActiveState = false;
    this.state.isDropArtistActive = false;
    this.setState(this.state);
  },

  getValue: function () {
    delete this.state.isDropArtistActive;
    delete this.state.isDropAlbumActive;
    delete this.state.SearchBoxType;
    delete this.state.visible;
    delete this.state.checked;
    this.state.lrc = this.state.lrc.split('\n').join('\\n');
    return this.state;
  },

  IsAdded: function(items, id) {
    return _.findIndex(items, {id: id}) !== -1;
  },

  handleItemClick: function(card) {
    if (card.type === 'Album') {
      this.state.album = card.data;
      this.setState(this.state);
    }

    if (card.type === 'Artist') {
      if (this.IsAdded(this.state.artists, card.data.id)) {
        return;
      }

      this.state.artists = this.state.artists || [];
      this.state.artists.push(card.data);
      this.setState(this.state);
    }
  },

  handleChange: function(evt) {
    this.state[evt.target.name] = evt.target.value;
    this.setState(this.state);
  },

  handleRemoveArtist: function(evt, data) {
    var id = data.id;
    if (!id) return;

    this.state.artists = _.filter(this.state.artists, function (item) {
      return item.id !== id;
    });

    this.setState(this.state);
  },

  handleRemoveAlbum: function(evt, data) {
    evt.preventDefault();
    this.state.album = {};
    this.setState(this.state);
  },

  changeSearchBoxType: function(type) {
    this.state.SearchBoxType = type;
    this.setState(this.state);
  },

  renderArtistMiniCards: function() {
    this.state.artists = this.state.artists || [];
    if (this.state.artists.length === 0) {
      return (
        <ul className='row'>
          <AddCardTips
            data-type='Artist'
            onClick={this.changeSearchBoxType.bind(null, 'Artist')}
            iconClassName='plus'
            title={window.lang.al_addar} />
        </ul>
      );
    } else {
      var self = this;
      var items = this.state.artists.map(function(item) {
        return (
          <ArtistMiniCard
            data={item}
            key={item.id}
            onRemove={self.handleRemoveArtist} />
        );
      });
      return (
        <ul className='row row_ul'>
          {items}
          <AddCardTips
            data-type='Artist'
            onClick={this.changeSearchBoxType.bind(null, 'Artist')}
            iconClassName='plus'
            title={window.lang.al_addar} />
        </ul>
      );
    }
  },

  renderAlbumMiniCards: function() {
    var album = this.state.album || {};
    if (!album.id) {
      return (
        <ul className='row row_ul p-b-10'>
          <AddCardTips
            data-type='Album'
            onClick={this.changeSearchBoxType.bind(null, 'Album')}
            iconClassName='edit'
            title={window.lang.tr_addal} />
        </ul>
      );
    } else {
      return (
        <ul className="row row_ul p-b-10">
          <AlbumMiniCard data={album} key={album.id} onRemove={this.handleRemoveAlbum} />
        </ul>
      );
    }
  },

  upload128Complete: function(data) {
    if (data.data.fullpath) {
      this.state.play_url_128 = data.data.fullpath;
    }
  },

  upload320Complete: function(data) {
    if (data.data.fullpath) {
      this.state.play_url_320 = data.data.fullpath;
    }
  },
  renderUpload: function() {
    let data = this.state;
    return (
      <Role component='div' className='card mt20 border' roleName='ADMIN'>
        <p className='form-control-static form-padding p-b-20'>{window.lang.tr_upload}</p>
        <div className='row margin0 p-b-10'>
          <div className='col-sm-6  p-l-0 p-r-10'>
            <Mp3Uploader tips={window.lang.tr_upload128} uploadComplete={this.upload128Complete} rate='128k' />
          </div>
          <div className='col-sm-6 p-l-10 p-r-0'>
            <Mp3Uploader tips={window.lang.tr_upload320} uploadComplete={this.upload320Complete} rate='320k'/>
          </div>
        </div>
        {/* <div className='text-right' style={{marginTop: '20px'}}>
          {this.props.children}
        </div> */}
      </Role>
    );
  },

  handleChecked: function (ev) {
    this.state.checked = ev.target.checked
    this.setState(this.state)
    if(ev.target.checked){
      let arr = []
      for(let i in mydata){
        mydata[i].all = true
        for(let j in mydata[i].children){
          mydata[i].children[j].checked = true
        }
        arr.push(mydata[i])
      }
      this.state.publish_info = JSON.stringify(arr)
      this.setState(this.state)
      this.onClose()
    }else{
      let arr = []
      for(let i in mydata){
        mydata[i].all = false
        for(let j in mydata[i].children){
          mydata[i].children[j].checked = false
        }
        arr.push(mydata[i])
      }
      this.state.publish_info = JSON.stringify(arr)
      this.setState(this.state)
    }
  },
  handClick:function(){
    this.state.publish_info = JSON.stringify(this.refs.form.getValue());
    this.setState(this.state)
    this.onClose()
  },
  render: function() {
    var data = this.state;
    var SearchBoxType = this.state.SearchBoxType;
    var selectedItems = [];
    if (SearchBoxType === 'Artist') {
      selectedItems = this.state.artists;
    }
    if (SearchBoxType === 'Album') {
      selectedItems = [this.state.album];
    }
    var dropAlbumClassName = classNames('card', 'mt20', 'border', 'card-dropzone', {
      'active': this.state.isDropAlbumActive
    });
    var dropArtistClassName = classNames('card', 'mt20', 'border', 'card-dropzone', {
      'active': this.state.isDropArtistActive
    });
    let dialog;
    //  || !this.state.destroyOnClose
    if (this.state.visible) {
      dialog = (
        <Dialog
          visible={this.state.visible}
          animation="zoom"
          maskAnimation="fade"
          onClose={this.onClose}
          className='ablums-dialog'
          title={
            <div className='ablums-dialog-title'>
              <span>高级选项</span>
              <div key="close" onClick={this.onClose}>
              X
              </div>
            </div>}
          mousePosition={this.state.mousePosition}
          footer={
            [
              <List publish_info={this.state.publish_info} ref='form' style={{overflow: 'hidden'}} />,
                <div style={{marginLeft:290}}>
                  <button style={{width:100,height:40}} onClick={this.handClick} type="button" className="btn btn-warning">确定</button>
                  <button style={{width:100,height:40,marginLeft:50}} type="button" className="btn btn-default" onClick={this.onClose}>取消</button>
                </div>
            ]
          }
        >
        </Dialog>
      );
    }
    return (
      <div className='show-wrap'>
        <div className='t-sb h61'>
          <h3 className='t-sb_detail p-l-20'>歌曲编辑</h3>
        </div>
        <div className='edit-wrap has-assist-box'>
          <div className='edit-form card border'>
            <div className='form-group'>
              <p className='form-control-static p-b-20'>{window.lang.tr_name}：</p>
              <input
                name='name'
                type='text'
                className='form-control form_control-width'
                value={data.name}
                onChange={this.handleChange}/>
            </div>
            <div className='form-group'>
              <p className='form-control-static p-b-20'>{window.lang.tr_ly}：</p>
              <input
                name='lyricist'
                className='form-control form_control-width'
                value={data.lyricist}
                onChange={this.handleChange}/>
            </div>
            <div className='form-group'>
              <p className='form-control-static p-b-20'>{window.lang.tr_co}：</p>
              <input
                name='composer'
                className='form-control form_control-width'
                value={data.composer}
                onChange={this.handleChange}/>
            </div>
            <div className='form-group'>
              <p className='form-control-static p-b-20'>{window.lang.tr_lyrics}：</p>
              <TextareaAutosize
                name='lrc'
                className='form-control form_control-width'
                onChange={this.handleChange}
                value={(data.lrc || '').split('\\n').join('\n')}></TextareaAutosize>
            </div>
          </div>

          <div
            className={dropArtistClassName}
            onDrop={this.handleDrop}
            onDragOver={this.allowArtistDrop}
            onDragEnter={this.handleDragArtistEnter}
            onDragLeave={this.handleDragArtistLeave}>
            <p className='form-control-static form-padding'>{window.lang.tr_ar}</p>
            {this.renderArtistMiniCards()}
          </div>

          <div
            className={dropAlbumClassName}
            onDrop={this.handleDrop}
            onDragOver={this.allowAlbumDrop}
            onDragEnter={this.handleDragAlbumEnter}
            onDragLeave={this.handleDragAlbumLeave}>
            <p className='form-control-static form-padding'>{window.lang.tr_al}</p>
            {this.renderAlbumMiniCards()}
          </div>

          {this.renderUpload()}

          <div className='card mt20 border' style={{height: '76px', lineHeight: '34px',}}>
            <div>发行设置：
              <a style={{font: '12px 微软雅黑', color: '#2ed0d7'}}><input type='checkbox' onChange={this.handleChecked} style={{width: 12, height: 12, margin: '0 5px 0 10px'}} />发行到全部平台</a>
              <button type="button" style={{display: this.state.checked ? 'none' : 'inline-block', marginLeft: 20,}} className="btn btn-warning" onClick={this.onClick}>高级选项</button>
            </div>
          </div>

          <div className='text-left mt20 submit_max'>
            {this.props.children}
          </div>

        </div>
        {dialog}
        <Assist type={SearchBoxType} selectedItems={selectedItems} onItemClick={this.handleItemClick} />
      </div>
    );
  }

});

module.exports = Form;
