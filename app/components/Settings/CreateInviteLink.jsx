var React = require('react');
var Reflux = require('reflux');
var axios = require('axios');
var Pager = require('../Common/Pager.jsx');
var APIHelper = require('./utils/APIHelper').APIHelper;
var CreateInviteLink = React.createClass({
  contextTypes: {
      router: React.PropTypes.func
  },
  getInitialState: function() {
    return {
      links: [],
      text: '',
      page: 1,
      totalPage: 0,
    };
  },
  componentDidMount: function () {
    this.getInviteLinks(this.state.page)
    // SettingsActions.find()
  },
  getInviteLinks: function (PAGE) {
    var that = this
    axios.get(`${APIHelper.getPrefix()}/api/v1/invitation/list?page=${PAGE}`, {withCredentials: true})
      .then(function (response) {
        that.setState({
          links: response.data.data.items,
          text: that.state.text,
          page: response.data.data.page,
          totalPage: response.data.data.totalPage,
        })
      })
      .catch(function (response) {
        console.log(response);
      });
  },
  onChange: function () {

  },
  getDefaultProps: function() {
    return {
      visiblePages: 5,
      size: 20
    };
  },
  getInvitationLink: function () {
    var that = this
    var APIHelper = require('./utils/APIHelper').APIHelper;
    axios.post(`${APIHelper.getPrefix()}/api/v1/invitation`, {
      company_name: "testname",
      company_id: 1,

    }, { withCredentials: true }).then(function (response) {
      console.log(response.data);
      that.setState({
        links: that.state.links,
        text: response.data.data.code,
        page: that.state.page,
        totalPage: that.state.totalPage
      })
      that.getInviteLinks(that.state.page)
    })
    .catch(function (response) {
      console.log(response);
    });
  },
  renderTableHeader: function () {
    return (
      <thead>
        <tr>
          <th>Invite Link</th>
          <th>Create Time</th>
          <th>Note</th>
          <th>Status</th>
        </tr>
      </thead>
    )
  },
  renderItems: function () {
    var trs = this.state.links.map( function (link) {
      return (
        <tr key={ link.id }>
          <td>{ link.code }</td>
          <td>{ link.created }</td>
          <td>{ link.username }</td>
          <td>{ link.status }</td>
        </tr>
      )
    })
    return (
      <tbody>{trs}</tbody>
    )
  },
  renderList: function(pageIndex) {
    var params = this.context.router.getCurrentQuery();
    params.page = pageIndex + 1;
    params.size = this.props.size;
    // this.context.router.transitionTo('albums', {}, params);
    this.getInviteLinks(pageIndex+1)
  },
  render: function(){
    return (
      <div>
        <div className='btn-group'>
          <input component='button' className="btn btn-default" placeholder="click get invite link button" value={this.state.text} onChange={this.onChange}></input>
          <span component='button' className="btn btn-default" onClick={this.getInvitationLink}>Get Invite Link</span>
        </div>
        <table className='table table-bordered table-striped' style={{marginTop:'12px'}}>
          {this.renderTableHeader()}
          {this.renderItems()}
        </table>
        <Pager
          current={this.state.page}
          total={this.state.totalPage}
          visiblePages={this.props.visiblePages}
          onPageChanged={this.renderList}
          titles={{
            first: window.lang.tfp,
            prev: window.lang.pp,
            prevSet: '...',
            nextSet: '...',
            next: window.lang.np,
            last: window.lang.tlp}}></Pager>
      </div>
    )

  }
})
module.exports = CreateInviteLink;
