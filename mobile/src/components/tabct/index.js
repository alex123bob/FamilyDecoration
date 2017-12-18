import { Tabs, WhiteSpace, Badge } from 'antd-mobile';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

const tabs = [
  { title: <Badge text={'3'}>员工工资</Badge>, sub: 'staffSalary' },
  { title: <Badge text={'今日(20)'}>待定板块</Badge>, sub: 'unknown' },
  { title: <Badge dot>我的</Badge>, sub: 'my' },
];

class TabCt extends Component {
  render() {
    return (
      <div>
        <Tabs tabs={tabs}
          initialPage={1}
          tabBarPosition="bottom"
          /* onChange={this.props.onTabChange.bind(this)} */
          onTabClick={this.props.onTabClick.bind(this)}
        >
          <div style={{ display: 'flex', 'flex-direction': 'column', alignItems: 'center', justifyContent: 'flex-start', height: document.documentElement.clientHeight, backgroundColor: '#fff' }}>
            {
              this.props.project.projects.data && this.props.project.projects.data.map((obj, index) => {
                return <div key={index}>{obj.projectName}</div>
              })
            }
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: document.documentElement.clientHeight, backgroundColor: '#fff' }}>
            待开发
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: document.documentElement.clientHeight, backgroundColor: '#fff' }}>
            {this.props.project.index} : {this.props.project.sub}
          </div>
        </Tabs>
      </div>
    )
  }
}

TabCt.propTypes = {
  onTabClick: PropTypes.func.isRequired,
  onTabChange: PropTypes.func,
  project: PropTypes.object
};

export default TabCt;
