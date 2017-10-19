import { connect } from 'dva';
import styles from './IndexPage.less';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import TabCt from '../components/tabct';

class IndexPage extends Component {
  render() {
    return (
      <TabCt />
    );
  }
}

export default connect()(IndexPage);
