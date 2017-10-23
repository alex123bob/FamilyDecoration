import { Tabs, WhiteSpace, Badge } from 'antd-mobile';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

const tabs = [
  { title: <Badge text={'3'}>员工工资</Badge> },
  { title: <Badge text={'今日(20)'}>待定板块</Badge> },
  { title: <Badge dot>我的</Badge> },
];

class TabCt extends Component {
  render() {
    return (
      <div>
        <Tabs tabs={tabs}
          initialPage={1}
          onChange={this.props.onTabChange.bind(this)}
          onTabClick={this.props.onTabClick.bind(this)}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: document.documentElement.clientHeight, backgroundColor: '#fff' }}>
            员工工资
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: document.documentElement.clientHeight, backgroundColor: '#fff' }}>
            待开发
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: document.documentElement.clientHeight, backgroundColor: '#fff' }}>
            我的
          </div>
        </Tabs>
      </div>
    )
  }
}

TabCt.propTypes = {
  onTabClick: PropTypes.func.isRequired,
  onTabChange: PropTypes.func,
};

export default TabCt;
