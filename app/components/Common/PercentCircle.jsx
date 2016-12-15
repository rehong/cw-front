var React = require('react');
var dbg = require('debug')('topdmc:Common/PercentCircle');
var CirCanvasProcess = require('./CirCanvasProcess.jsx');
var Reflux = require('reflux');
const TotalDataStore = require('app/stores/TotalDataStore');
const TotalDataActions = require('app/actions/TotalDataActions');


var PercentCircle = React.createClass({

  mixins: [Reflux.connect(TotalDataStore, 'totalData')],

  componentDidMount: function() {
    TotalDataActions.get();
  },
  render: function(){
    // var songNumber=this.props.percent[0].split('/');
    // var songPercent=(songNumber[0]/songNumber[1]*100).toFixed(0);
    // var singerNumber=this.props.percent[1].split('/');
    // var singerPercent=(singerNumber[0]/singerNumber[1]*100).toFixed(0);
    // var specialNumber=this.props.percent[2].split('/');
    // var specialPercent=(specialNumber[0]/specialNumber[1]*100).toFixed(0);

    return(
      // <div className='datum-percent'>
      //   <p>{window.lang.pr0}</p>
      //   <ul className='row'>
      //     <li className='col-xs-4'>
      //       <CirCanvasProcess process={songPercent} color='#f48daf' height='120' width='120' />
      //       <p>{window.lang.pr1}</p>
      //     </li>
      //     <li className='col-xs-4'>
      //       <CirCanvasProcess process={singerPercent} color='#62a1d5' height='120' width='120' />
      //       <p>{window.lang.pr2}</p>
      //     </li>
      //     <li className='col-xs-4'>
      //       <CirCanvasProcess process={specialPercent} color='#2ed0d7' height='120' width='120' />
      //       <p>{window.lang.pr3}</p>
      //     </li>
      //   </ul>
      // </div>
      <div className="totalcard">
        <p className="ttc-title"><b>分发渠道</b><a className='look' onClick={this.props.onClick}>查看详情</a><b className='sub'>3</b></p>
        <p className="ttc-sum"><span>17</span><span className="ttc-unit">种</span></p>
        <div className="ttc-class">
          <div className='row account' style={{marginBottom: '8px'}}>
            <div className='col-sm-8'>
              <p>已授权</p>
              <p className="ttc-num"><span>8</span><span className="ttc-unit rmb">张</span></p>
            </div>
            <div className='col-sm-4'>
              <p>未授权</p>
              <p className="ttc-num"><span>9</span><span className="ttc-unit rmb">张</span></p>
            </div>
          </div>
        </div>
      </div>
    )
  }
})
module.exports = PercentCircle;
