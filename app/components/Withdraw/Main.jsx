import React from 'react';
import Company from './Company.jsx';
import Personal from './Personal.jsx';
import History from './History.jsx';
import axios from 'axios';
import {APIHelper} from '../../utils/APIHelper';
import Loader from '../Common/Loader.jsx';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      successData: {}
    };
  }

  componentDidMount() {
    axios.all([this.getBankInfo(), this.getStatisticsInfo()]).then(axios.spread((bankInfo, statisticsInfo) => {
      this.setState({
        loaded: true,
        bankInfo: bankInfo.data,
        statisticsInfo: statisticsInfo.data.data
      });
    }));
  }

  getStatisticsInfo() {
    return axios({
      method: 'GET',
      url: APIHelper.getPrefix() + '/statistics',
      responseType: 'json',
      withCredentials: true
    });
  }

  getBankInfo() {
    return axios({
      method: 'GET',
      url: APIHelper.getPrefix() + '/finance/bankinfo',
      responseType: 'json',
      withCredentials: true
    });
  }

  send(data) {
    return axios({
      method: 'POST',
      url: APIHelper.getPrefix() + '/finance/withdraws',
      responseType: 'json',
      data: data,
      withCredentials: true
    });
  }

  setSuccessData(data) {
    this.state.successData = data.data;
    this.setState(this.state);
  }

  renderForm() {
    if (this.state.loaded === false) {
      return <Loader />;
    }
    if (this.state.bankInfo['account_type'] == 1) {
      return <Personal setSuccessData={this.setSuccessData.bind(this)} send={this.send} bankInfo={this.state.bankInfo} statisticsInfo={this.state.statisticsInfo} />;
    }
    if (this.state.bankInfo['account_type'] == 2) {
      return <Company setSuccessData={this.setSuccessData.bind(this)} send={this.send} bankInfo={this.state.bankInfo} statisticsInfo={this.state.statisticsInfo} />;
    }
    return <p>账户类型错误</p>;
  }

  render() {
    return (
      <div className='withdraw-wrap'>
        <h1>提现申请</h1>
        <div className='panel'>
          <div className='panel-body container-fluid'>
            <div className='row'>
              <div className='col-sm-6'>
                {this.renderForm()}
              </div>
              <div className='col-sm-6'>
                <p>提示：</p>
                <p className='mt10'>法人公司需依据申请提现金额开具增值税专用发票，并邮寄至北京成为科技；</p>
                <p>收到发票并复核后DMC将及时进行付款。</p>
                <p className='mt10'><strong>增值税专用发票抬头：北京成为科技有限公司</strong></p>
                <p><strong>邮寄地址：北京市朝阳区雅宝路12号华声国际大厦1201</strong></p>
                <p><strong>联系人：蔡润佳</strong></p>
                <p><strong>联系电话：010-59306967</strong></p>
                <p className='mt10'>独立音乐人收到的金额为申请提现金额扣除DMC代扣代缴个人所得税后的金额（个人所得税纳税标准按国家规定进行扣除）</p>
                <p className='mt10'>由于现财务转账需要操作时间，故上周五至本周四的提现申请将在本周五统一进行汇款。本周五至下周四的提现申请将在下周五统一进行汇款。</p>
                <p>请仔细复核您的账户信息，如有疑问可联系微信公众账号。</p>
              </div>
            </div>
          </div>
        </div>
        <h1>提现记录</h1>
          <div className='panel'>
            <div className='panel-body container-fluid'>
              <div className='row'>
                <History successData={this.state.successData} />
              </div>
            </div>
          </div>
      </div>
    );
  }
};

export default Main;