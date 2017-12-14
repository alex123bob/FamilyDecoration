import { connect } from 'dva';
import styles from './IndexPage.less';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import TabCt from '../components/tabct';
import { withRouter } from 'react-router-dom';

class IndexPage extends Component {
  render() {
    const { match, location, history, dispatch, project } = this.props;
    const tabs = (
      <TabCt
        onTabClick={
          (tab, index) => {
            dispatch({
              type: 'project/fetch',
              payload: {
                index: index,
                sub: tab.sub
              }
            });
          }
        }
        project={project}
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

function mapStateToProps (state){
  return {
    project: state.project
  };
}

export default connect(mapStateToProps)(withRouter(IndexPage));
