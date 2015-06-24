import BaseChart from './BaseChart.jsx'
import classNames from 'classnames'

class SongChart extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      whichButton : 30,
      option : this.createOpt(120)
    }
  }

  createOpt(_){
    let date = []
    let data = [80000, 90000, 70000, 75000, 85000,
                100000, 90000, 100000, 90000, 85000,
                80000, 90000, 70000, 75000, 75000,
                85000, 85000, 80000, 70000, 90000,
                100000, 70000, 85000, 85000, 80000,
                90000, 70000, 75000, 90000, 85000,
                80000, 90000, 70000, 75000, 85000,
                100000, 90000, 100000, 90000, 85000,
                80000, 90000, 70000, 75000, 75000,
                85000, 85000, 80000, 70000, 90000,
                100000, 70000, 85000, 85000, 80000,
                90000, 70000, 75000, 90000, 85000,
                80000, 90000, 70000, 75000, 85000,
                100000, 90000, 100000, 90000, 85000,
                80000, 90000, 70000, 75000, 75000,
                85000, 85000, 80000, 70000, 90000,
                100000, 70000, 85000, 85000, 80000,
                90000, 70000, 75000, 90000, 85000,
                80000, 90000, 70000, 75000, 85000,
                100000, 90000, 100000, 90000, 85000,
                80000, 90000, 70000, 75000, 75000,
                85000, 85000, 80000, 70000, 90000,
                100000, 70000, 85000, 85000, 80000,
                90000, 70000, 75000, 90000, 85000
                ]
    let fix = (_) => {
      if(Number(_)<10){
        return '0'+_
      }
      return _
    };
    ((_) => {
      let today = +new Date()
      let time = 86400000
      while( _ > 0 ){

        let arr = new Date(today).toLocaleDateString().split('/')
        arr = arr.map(fix)
        date.unshift(arr.slice(0,2).join('/'))
        today -= time
        _--
      }
    })(_)
    data = data.reverse().slice(0, _).reverse()

    return {
      title : {
        text: '歌曲播放总量',
        subtext: '2015'
      },
      tooltip : {
        trigger: 'axis'
      },
      dataZoom : {
        show : true,
        realtime : true,
        start : 75,
        end : 100,
      },
      xAxis : [
      {
        type : 'category',
        boundaryGap : false,
        data : date
      }
      ],
      yAxis : [
      {
        type : 'value'
      }
      ],
      series : [
      {
        name:'歌曲播放总量',
        type:'line',
        smooth:true,

        itemStyle: {normal: {areaStyle: {type: 'default',color: 'RGBA(209, 242, 243, .5)'}}},
        data:data,
        markLine : {
          data : [
          {type : 'average', name : '平均值'}
          ]
        }
      }
      ]
    }
  }
  _changeDate(_){
    var result = this.createOpt(_)
    this.setState({
      whichButton: _,
      option: result
    })
  }
  render() {
    let arr = [7, 14, 30]
    let buttons = arr.map((val) =>
      <button key={val} type="button"
      className={classNames('btn btn-default', this.state.whichButton==val?'active':'')}
      onClick={function(){this._changeDate(val)}.bind(this)}
      >近{val}天</button>
    )
    return (
      <div style={{position:'relative'}}>
        <BaseChart option={this.state.option} style={this.props.style} />
        {/* <div
          className="btn-group"
          role="group"
          aria-label=""
          style={{position:'absolute', top: 0, right: 0}}>
          {buttons}
        </div> */}
      </div>

    )
  }
}

SongChart.defaultProps = {
  style: {width:'100%',height:'400px'},
}

export default SongChart
