var React = require('react');
var Reflux = require('reflux');
const TopsingerStore = require('app/stores/TopsingerStore');
const TopsingerActions = require('app/actions/TopsingerActions');
var ArtistItemWrapper = React.createClass({

  render: function(){
    // 前三名使用粉色,其他使用默认色
    var _artist = this.props.data;
    var rank = this.props.rank+1;
    _artist.classname = "tsr-rank-top";
    if(rank > 3){
      _artist.classname = "tsr-rank-other";
    }
    // set default artist avatar
    var imgUrl = _artist.artist_photo || 'images/loading.gif';
    var _style={ backgroundImage:'url(' + imgUrl + ')' }
    // set _artist.link
    _artist.link = `#/artists/${_artist.artist_id}`

    if(rank<=5){
    return (
      <p>
        <span className={_artist.classname}><b>{rank}</b></span>
        <a href={_artist.link}>
        <span className="tsr-avatar" style={_style}></span>
        <span className="tsr-name">{_artist.artist_name}</span>
        <span className="tsr-num">{_artist.stream_count}</span></a>
      </p>
    );
  }else {
    return <p></p>;
  }
  }
});

var TopSingers = React.createClass({
  mixins: [Reflux.connect(TopsingerStore, 'topsinger')],

  componentDidMount: function() {
    TopsingerActions.find();
  },
  // getInitialState: function() {
  //   return {
  //     data2: [
  //       {rank: 1, avatar: "http://i.gtimg.cn/music/photo/mid_singer_500/I/o/003NThQh3ujqIo.jpg", name: "周华健", num: 62145368, id: 96},
  //       {rank: 2, avatar: "http://i.gtimg.cn/music/photo/mid_singer_500/N/k/000GGDys0yA0Nk.jpg", name: "梁静茹", num: 61145368, id: 44},
  //       {rank: 3, avatar: "http://i.gtimg.cn/music/photo/mid_singer_500/c/6/000cISVf2QqLc6.jpg", name: "莫文蔚", num: 59145368, id: 54},
  //       {rank: 4, avatar: "http://i.gtimg.cn/music/photo/mid_singer_500/c/z/0000mFvh1jtLcz.jpg", name: "张信哲", num: 56145368, id: 167},
  //       {rank: 5, avatar: "http://i.gtimg.cn/music/photo/mid_singer_500/l/q/00235pCx2tYjlq.jpg", name: "许巍", num: 48145368, id: 3376}
  //     ]
  //   };
  // },


  render: function(){

    if(this.state.topsinger.loaded&&this.state.topsinger.data.data.data[0]){
    return(
      <div className="topSingers">
        <p className="tsr-title"><b>{window.lang.at5}</b></p>
        <p className="tsr-head">
          <span className="tsr-rank"><b>{window.lang.rank}</b></span>
          <span className="tsr-singer"><b>{window.lang.artist}</b></span>
          <span className="tsr-total"><b>{window.lang.at5tp}</b></span>
        </p>
        <div className="tsr-body">
          {this.state.topsinger.data.data.data.map(function(artist,i){
            return <ArtistItemWrapper data={artist} key={artist.artist_id} rank={i}/>
          })}
        </div>
      </div>
    )}else {
      return(
        <div className="topSingers">
          <p className="tsr-title"><b>{window.lang.at5}</b></p>
          <p className="tsr-head">
            <span className="tsr-rank"><b>{window.lang.rank}</b></span>
            <span className="tsr-singer"><b>{window.lang.artist}</b></span>
            <span className="tsr-total"><b>{window.lang.at5tp}</b></span>
          </p>
          <div className='nodata'>{window.lang.nodata}</div>
        </div>

      )
    }
  }
})
module.exports =TopSingers;
