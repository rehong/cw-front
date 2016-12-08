var React = require('react');
var Reflux = require('reflux');
var SongStore = require('../../stores/SongStore');
var SongActions = require('../../actions/SongActions');
var Form = require('./Form.jsx');
var Loader = require('../Common/Loader.jsx');

/**
 * 编辑歌手
 */
var Edit = React.createClass({

  mixins: [Reflux.connect(SongStore, 'song')],

  propTypes: {
    id: React.PropTypes.string.isRequired,
    onUpdated: React.PropTypes.func,
    onCancelClick: React.PropTypes.func.isRequired
  },

  componentDidMount: function () {
    SongActions.get(this.props.id);
  },

  /**
   * 保存成功后进行事件的通知
   * @param nextProps
   * @param nextState
   */
  componentWillUpdate: function (nextProps, nextState) {
    if (nextState.song.updated) {
      this.props.onUpdated(nextState);
    }
  },

  /**
   * 保存处理
   * @param e
   */
  handleSubmit: function () {
    var data = this.refs.form.getValue();
    SongActions.update(this.props.id, data);
  },

  render: function () {

    if (!this.state.song.loaded) {
      return (<Loader/>);
    }

    return (
        <Form ref="form" data={this.state.song.data}>
          <button className='btn btn-warning mr10 btn-w-h' onClick={this.handleSubmit}>{window.lang.save}</button>
          <button className='btn btn-default btn-w-h' onClick={this.props.onCancelClick}>{window.lang.cancel}</button>
        </Form>
    );
  }
});

module.exports = exports = Edit;
