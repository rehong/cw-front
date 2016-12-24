'use strict';
var React = require('react');
var Reflux = require('reflux');
var ArtistStore = require('../../stores/ArtistStore');
var ArtistActions = require('../../actions/ArtistActions');
var Loader = require('../../components/Common/Loader.jsx');
var SongChart = require('../Common/Charts/SongChart.jsx');
var SongChannelChart = require('../Common/Charts/SongChannelChart.jsx');

var Albums = require('./Albums.jsx');

/*************************************************************************
 * 歌手详情显示
 **************************************************************************/
var Detail = React.createClass({

  mixins: [Reflux.connect(ArtistStore, 'artist')],

  contextTypes: {
    router: React.PropTypes.func
  },

  propTypes: {
    id: React.PropTypes.string.isRequired,
    onEditClick: React.PropTypes.func.isRequired
  },

  componentDidMount: function () {
    ArtistActions.get(this.props.id);
  },

  filter: function (value) {
    return value.split(/\n|\r/).join('<br/>');
  },

  handleBack: function () {
    history.go(-1);
  },

  render: function () {

    if (!this.state.artist.loaded) {
      return <Loader/>
    }

    if (this.state.artist.error !== undefined) {
      return (
        <div>没有找到歌手信息</div>
      );
    }

    var data = this.state.artist.data;
    var photoStyles = {
      backgroundImage: 'url(' + data['photo'] + ')'
    };

    var desc = data.desc || '暂无简介';
    return (
      <div className='show-wrap topdmc'>
        <div className='show-top'>
          {/* <div className='photo pull-left' style={photoStyles}></div> */}
          <div className='ctrl-btn pull-right'>
            <button className='btn btn-warning mr10 btn-w-h' onClick={this.props.onEditClick}>{window.lang.edit}</button>
            <button className='btn btn-default btn-w-h' onClick={this.handleBack}>{window.lang.back}</button>
          </div>
          <div className='info'>
            <p>{data.name}- {data.country}</p>
          </div>
        </div>
        <div className='has-top-bar'>
          <div className='card margin0 border'>
            <SongChart url={'artists/'+ this.state.artist.data.id +'/play_total'}/>
          </div>
          <div className='card mt20 margin0 border'>
            <SongChannelChart url={'artists/'+ this.state.artist.data.id +'/play_total_sp'} />
          </div>
          <div className='card mt20 margin0 border'>
            <h4 className='intro margin0 margin-t-0 margin-b-0 p-b-20'>艺人简介：</h4>
            <p className='data-p p-b-10' dangerouslySetInnerHTML={{__html:this.filter(desc)}}></p>
          </div>
          <Albums artist_id={this.context.router.getCurrentParams().id} />
        </div>
      </div>
    );
  }

});

module.exports = Detail;
