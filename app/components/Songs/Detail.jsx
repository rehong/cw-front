'use strict';
var React = require('react');
var Reflux = require('reflux');
var SongStore = require('../../stores/SongStore');
var SongActions = require('../../actions/SongActions');
var AlbumMiniCard = require('../Albums/MiniCard.jsx');
var ArtistMiniCard = require('../Artists/MiniCard.jsx');
var StringUtil = require('../../utils/StringUtil');

var SongChart = require('../Common/Charts/SongChart.jsx');
var SongChannelChart = require('../Common/Charts/SongChannelChart.jsx');

var Loader = require('../Common/Loader.jsx');

var Detail = React.createClass({

  mixins: [Reflux.connect(SongStore, 'song')],

  componentDidMount: function () {
    SongActions.get(this.props.id);
  },

  // playUrlFilter: function() {
  //   let url = null;
  //   const _data = this.state.song.data;
  //   if (_data.play_url_128 != null) {
  //     url = _data.play_url_128;
  //     return url;
  //   }
  //   if (_data.play_url_320 != null) {
  //     url = _data.play_url_320;
  //     return url;
  //   }
  //   return url;
  // },
  //
  // playOrPause: function() {
  //   if (this.player.paused) {
  // 		this.player.play();
  // 		return;
  // 	}
  // 	this.player.pause();
  // },

  renderAlbumMiniCards: function () {
    this.state.song.data.albums = this.state.song.data.albums || [];
    var self = this;
    return this.state.song.data.albums.map(function (item) {
      return (
        <AlbumMiniCard data={item} key={item.id} readonly={true} onRemove={self.handleRemoveAlbum}/>
      );
    });
  },

  renderArtistMiniCards: function () {
    this.state.song.data.artists = this.state.song.data.artists || [];
    var self = this;
    return this.state.song.data.artists.map(function (item) {
      return (
        <ArtistMiniCard data={item} key={item.id} readonly={true} onRemove={self.handleRemoveAlbum}/>
      );
    });
  },
  filter:function(value){
    return value.split('\\n').join('<p></p>');
  },
  handleBack: function() {
    history.go(-1);
  },
  renderCopyright: function(data) {
    if (!data.copyRight) {
      return <p className='mt10'>版权信息暂未录入</p>;
    }
    var copyright = data.copyRight;
    return (
      <div className='mt10'>
        <p>版权方：{copyright.company && copyright.company['name'] || '暂无'}</p>
        <p>版权有效期：{copyright.expired && moment(copyright.expired).format('YYYY年MM月DD日') || '暂无'}</p>
        <p>独家授权：{copyright.client && copyright.client['name'] || '暂无'}</p>
        <p>授权有效期：{copyright.client_expired && moment(copyright.client_expired).format('YYYY年MM月DD日') || '暂无'}</p>
      </div>
    );
  },
  render: function () {
    if (!this.state.song.loaded) {
      return <Loader />;
    }
    var data = this.state.song.data || {};
    var photoStyles = {
      backgroundImage: 'url(' + (data.album||{}).photo + ')'
    };
    var albums = this.state.song.data.albums || [{'name': ''}];
    return (
      <div className='show-wrap'>
        <div className='show-top'>
          <div className='photo pull-left' style={photoStyles}></div>
          <div className='ctrl-btn pull-right'>
            <button
                className='btn btn-warning mr10'
                onClick={this.props.onEditClick}>编辑</button>
            <button
              className='btn btn-default'
              onClick={this.handleBack}>返回</button>
          </div>
          <div className='info'>
            <p className='data'>{data.name} - {(data.album||{}).name}</p>
          </div>
        </div>
        <div className='has-top-bar'>
          {/*<div className='card'>
            <p>版权信息：</p>
            {this.renderCopyright(data)}
          </div>*/}
          <div className='card'>
            <SongChart url={'tracks/'+ this.state.song.data.id +'/play_total'} />
          </div>
          <div className='card mt20'>
            <SongChannelChart url={'tracks/'+ this.state.song.data.id +'/play_total_sp'} />
          </div>
          <div className='card mt20'>
            <div>
              <p>歌手：</p>
              <ul className="search-box-results clearfix">{this.renderArtistMiniCards()}</ul>
            </div>
          </div>
          <div className='card mt20'>
            <p className='data mt20' dangerouslySetInnerHTML={{__html:this.filter(data.lrc || ' 暂无 ')}}></p>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Detail;
