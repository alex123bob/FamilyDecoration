import { connect } from 'dva';
import styles from './IndexPage.less';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import TabCt from '../components/tabct';
import { withRouter } from 'react-router-dom';

class IndexPage extends Component {
  render() {
    const { match, location, history } = this.props;

    const tabs = (
      <TabCt
        onTabClick={
          (tab, index) => {
            console.log(history);
          }
        }
        onTabChange={() => { }}
      />
    );
    return tabs;
  }
}

IndexPage.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default connect()(withRouter(IndexPage));
