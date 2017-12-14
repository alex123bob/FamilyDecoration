import request from '../utils/request';

export function getProjects() {
  return request('http://localhost/FamilyDecoration/libs/api.php?action=Project.get&debug=true');
}
