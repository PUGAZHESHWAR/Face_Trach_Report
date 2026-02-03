export interface Student {
  id: string;
  roll_number: string;
  full_name: string;
  email: string;
  phone?: string;
  course?: string;
  semester?: string;
  gender?: string;
  date_of_birth?: string;
  department_id?: string;
  class_id?: string;
  organization_id?: string;
  attendance_records: AttendanceRecord[];
  total_present: number;
  total_absent: number;
  attendance_percentage: number;
}

export interface AttendanceRecord {
  id: number;
  date: string;
  status: string;
}

export interface AttendanceStats {
  total_records: number;
  present_count: number;
  absent_count: number;
  overall_percentage: number;
}

export interface FilterOptions {
  search: string;
  department_id: string;
  class_id: string;
  course: string;
  semester: string;
  date_from: string;
  date_to: string;
  attendance_status: string;
  organization_id: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Class {
  id: string;
  name: string;
}