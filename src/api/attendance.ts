import { Student, AttendanceStats, FilterOptions, Department, Class } from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

export const fetchStudents = async (filters: FilterOptions): Promise<Student[]> => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value.trim() !== '') {
      params.append(key, value);
    }
  });

  const response = await fetch(`${API_BASE_URL}/students?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch students: ${response.statusText}`);
  }
  
  return response.json();
};

export const fetchAttendanceStats = async (filters: Partial<FilterOptions>): Promise<AttendanceStats> => {
  const params = new URLSearchParams();
  
  if (filters.date_from) params.append('date_from', filters.date_from);
  if (filters.date_to) params.append('date_to', filters.date_to);
  if (filters.department_id) params.append('department_id', filters.department_id);
  if (filters.organization_id) params.append('organization_id', filters.organization_id);

  const response = await fetch(`${API_BASE_URL}/attendance/stats?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch attendance stats: ${response.statusText}`);
  }
  
  return response.json();
};

export const fetchDepartments = async (): Promise<Department[]> => {
  const response = await fetch(`${API_BASE_URL}/departments`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch departments: ${response.statusText}`);
  }
  
  return response.json();
};

export const fetchClasses = async (): Promise<Class[]> => {
  const response = await fetch(`${API_BASE_URL}/classes`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch classes: ${response.statusText}`);
  }
  
  return response.json();
};

// Mock data for demo purposes (remove when backend is ready)
export const mockStudents: Student[] = [
  {
    id: '1',
    roll_number: 'CS001',
    full_name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    course: 'Computer Science',
    semester: '6',
    gender: 'Male',
    date_of_birth: '2000-05-15',
    department_id: 'dept1',
    class_id: 'class1',
    organization_id: 'org1',
    attendance_records: [
      { id: 1, date: '2024-01-15', status: 'Present' },
      { id: 2, date: '2024-01-16', status: 'Absent' },
      { id: 3, date: '2024-01-17', status: 'Present' },
    ],
    total_present: 2,
    total_absent: 1,
    attendance_percentage: 66.67
  },
  // Add more mock students as needed
];