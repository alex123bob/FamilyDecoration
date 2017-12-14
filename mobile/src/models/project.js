import * as projectSvc from '../services/project';

export default {

  namespace: 'project',

  state: {
    name: 'initial name',
    projects: []
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      const projects = yield call(projectSvc.getProjects);
      payload = {...payload, projects: {
        ...projects.data
      }};
      yield put({ type: 'save', payload: payload });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
