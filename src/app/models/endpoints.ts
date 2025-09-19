import { environment } from 'src/environments/environment';

const { url, version } = environment.api;
const API_URL = `${url}/v${version}`;
const ENDPOINTS = {
  TEACHERS: {
    DEFAULT: `${API_URL}/teacher`,
    SEARCH: `${API_URL}/teacher/search`,
    HAS_ASSOCIATED_GRADES: `${API_URL}/teacher/hasassociatedgrades`
  },
  STUDENTS: {
    DEFAULT: `${API_URL}/student`,
    EXCEPT: `${API_URL}/student/except`,
    HAS_ASSOCIATED_GRADES: `${API_URL}/student/hasassociatedgrades`
  },
  GRADES: {
    DEFAULT: `${API_URL}/grade`
  }
} as const;

Object.freeze(ENDPOINTS);

export { API_URL, ENDPOINTS };
