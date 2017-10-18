import React from 'react';
import { connect } from 'dva';
import styles from './IndexPage.less';
import { Component } from 'react';
import { PropTypes } from 'prop-types';

import { Tabs, WhiteSpace, Badge } from 'antd-mobile';

const tabs = [
  { title: <Badge text={'3'}>员工工资</Badge> },
  { title: <Badge text={'今日(20)'}>待定板块</Badge> },
  { title: <Badge dot>我的</Badge> },
];

const TabCt = () => (
  <div>
    <Tabs tabs={tabs}
      initialPage={1}
      onChange={(tab, index) => { console.log('onChange', index, tab); }}
      onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
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
    <WhiteSpace />
    <WhiteSpace />
  </div>
);

export default connect()(TabCt);
