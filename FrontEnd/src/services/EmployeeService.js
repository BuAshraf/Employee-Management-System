import axios from 'axios';

const API_URL = 'http://localhost:8080/api/employees';

class EmployeeService {
  getAllEmployees() {
    return axios.get(API_URL);
  }

  createEmployee(employee) {
    return axios.post(API_URL, employee);
  }

  getEmployeeById(id) {
    return axios.get(`${API_URL}/${id}`);
  }

  updateEmployee(id, employee) {
    return axios.put(`${API_URL}/${id}`, employee);
  }

  updateEmployeeStatus(id, status) {
    return axios.put(`${API_URL}/${id}/status`, null, {
      params: { status }
    });
  }

  deleteEmployee(id) {
    return axios.delete(`${API_URL}/${id}`);
  }

  searchEmployees(query) {
    return axios.get(`${API_URL}/search?query=${encodeURIComponent(query)}`);
  }
}

const employeeService = new EmployeeService();
export default employeeService;
