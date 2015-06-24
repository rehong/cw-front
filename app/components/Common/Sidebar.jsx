var classNames = require('classnames');
const dbg = require('debug')('topdmc:Sidebar/component');

var OnlineState = require('app/components/OnlineState.react.jsx');
const OnlineStateStore = require('app/stores/OnlineStateStore');
var NavItemLink = React.createClass({
  propTypes: {
    activeClassName: React.PropTypes.string.isRequired,
    to: React.PropTypes.string.isRequired,
    params: React.PropTypes.object,
    query: React.PropTypes.object,
    onClick: React.PropTypes.func
  },
  contextTypes: {
    router: React.PropTypes.func.isRequired
  },
  getDefaultProps: function () {
    return {
      activeClassName: 'active'
    };
  },
  getHref: function () {
    return this.context.router.makeHref(this.props.to, this.props.params, this.props.query);
  },
  getClassName: function () {
    var names = {};

    if (this.props.className) {
      names[this.props.className] = true;
    }

    if (this.context.router.isActive(this.props.to, this.props.params, this.props.query)) {
      names[this.props.activeClassName] = true;
    }

    return classNames(names);
  },

  handleRouteTo: function (event) {
    var allowTransition = true;
    var clickResult;

    if (this.props.onClick) {
      clickResult = this.props.onClick(event);
    }

    function isLeftClickEvent(event) {
      return event.button === 0;
    }

    function isModifiedEvent(event) {
      return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
    }

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }

    if (clickResult === false || event.defaultPrevented === true) {
      allowTransition = false;
    }

    event.preventDefault();

    if (allowTransition) {
      this.context.router.transitionTo(this.props.to, this.props.params, this.props.query);
    }
  },
  render: function () {
    var {
      to,
      params,
      query,
      active,
      icon,
      text
    } = this.props;
    if (this.props.active === undefined) {
      active = this.context.router.isActive(to, params, query);
    }
    return (
      <li className={this.getClassName()}>
        <a active={active} href={this.getHref()} onClick={this.handleRouteTo} ref="linkItem">
          <i className={icon}></i>
          <span>{text}</span>
        </a>
      </li>
    );
  }
});

var ToggleMenuButton = React.createClass({
  propTypes: {
    toggleMenuClass: React.PropTypes.string.isRequired,
    handleToggleMenuClick: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      toggleMenuClass: 'angle-double-left'
    };
  },

  render: function () {
    var toggleMenuClassName = classNames('fa', 'fa-' + this.props.toggleMenuClass);
    return (
      <a className='toggle-menu' onClick={this.props.handleToggleMenuClick}>
        <i className={toggleMenuClassName}></i>
      </a>
    );
  }

});
var OnlineStatecircle = React.createClass({

  mixins: [Reflux.connect(OnlineStateStore, 'onlineState')],

  render: function () {
    var circleColor = '#cecece';
    if (this.state.onlineState && (this.state.onlineState.startsWith('Connected') || this.state.onlineState.startsWith('Authenticated'))) {
      circleColor = '#5cb85c'; // 在线
    }
    dbg('OnlineStatecircle circleColor=' + circleColor + ' this.state', this.state);
    var circleStyle = {
      borderColor: circleColor,
      backgroundImage: 'url(' + this.props.imgUrl + ')'
    }
    return (
      <div className='whoami-img' style={circleStyle}/>
    )
  }
})
var Sidebar = React.createClass({

  getDefaultProps: function () {
    return {
      logoSrc: 'images/logo2.png',
      navItems: [
        {
          faIconName: 'home',
          text: '基本信息',
          to: 'base'
        }, {
          faIconName: 'street-view',
          text: '艺人管理',
          to: 'artists'
        }, {
          faIconName: 'edit',
          text: '专辑管理',
          to: 'albums'
        }, {
          faIconName: 'music',
          text: '曲库管理',
          to: 'songs'
        }, {
          faIconName: 'bar-chart',
          text: '图表统计',
          to: 'charts'
        }, {
          faIconName: 'calendar',
          text: '日程安排',
          to: 'calendar'
        }, {
          faIconName: 'users',
          text: '人员管理',
          to: 'users'
        }, {
          faIconName: 'cogs',
          text: '系统设置',
          to: 'settings'
        }, {
          faIconName: 'motorcycle',
          text: '版权管理',
          to: 'publishers'
        }
      ]
    };
  },

  render: function () {
    var navItems = this.props.navItems.map(function (item, i) {
      var className = classNames('fa', 'fa-' + item.faIconName);
      var text = item.text;
      return (
        <NavItemLink icon={className} key={i} text={text} to={item.to}/>
      );
    });
    var imgUrl = window.DMC_AVATAR || 'https://s3.cn-north-1.amazonaws.com.cn/dmc-img/avatar/40039e9c-bcdf-4dbc-8827-fa8082eda648.jpg';
    var userName = window.DMC_USERNAME;
    return (
      <aside className='sidebar'>
        <div className='sidebar-wrap'>
          <div className='logo'>
            <a href='/'>
              <img src={this.props.logoSrc}/>
            </a>
          </div>
          <ul className='main-menu'>{navItems}</ul>
        </div>
        <div className='sidebar-assist'>
          <div className='whoami-wrap'>
            <OnlineStatecircle imgUrl={imgUrl}/>
            <p className="whoami-username ellipsis">{userName}</p>
          </div>
          <ToggleMenuButton handleToggleMenuClick={this.props.handleToggleMenuClick} toggleMenuClass={this.props.toggleMenuClass}/>
        </div>
      </aside>
    );
  }

});

module.exports = Sidebar;
