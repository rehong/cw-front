var React = require('react');
var ListSearch = React.createClass({

  propsTypes: {
    handleSearch: React.PropTypes.func.isRequired,
    placeholder: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      placeholder: window.lang.pesk
    };
  },

  getInitialState: function() {
    return {
      value: ''
    };
  },

  getValue: function() {
    return this.state.value;
  },

  handleChange: function(evt) {
    this.setState({
      value: evt.target.value
    });
  },

  handleKeyDown: function(evt) {
    if (evt.keyCode == 13) {
      this.props.handleSearch();
    }
  },

  render: function() {
    return (
      <div className='s-sb'>
        <div className='s-sb-header'>
          <input
            type='text'
            className='form-control s-sb-im'
            placeholder={this.props.placeholder}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown} />
          <a onClick={this.props.handleSearch}><div className="s-sb-button"><i className='feed-icon fa fa-search'></i></div></a>
        </div>
      </div>
    );
  }

});

module.exports = ListSearch;
