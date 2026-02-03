import React, { useState, useEffect } from 'react';
import { X, RefreshCcw } from 'lucide-react';
import { FilterOptions } from '../types';
import { fetchDepartments, fetchClasses } from '../api/attendance';

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  onClearFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, onClearFilters }) => {
  const [departments, setDepartments] = useState<{id: string; name: string}[]>([]);
  const [classes, setClasses] = useState<{id: string; name: string}[]>([]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [depts, cls] = await Promise.all([
          fetchDepartments(),
          fetchClasses()
        ]);
        setDepartments(depts);
        setClasses(cls);
      } catch (error) {
        console.error('Error loading filter options:', error);
      }
    };

    loadOptions();
  }, []);

  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];
  const attendanceStatuses = [
    { value: '', label: 'All' },
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={onClearFilters}
          className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
          <span className="text-sm">Clear All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Department Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <select
            value={filters.department_id}
            onChange={(e) => onFilterChange({ department_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>

        {/* Class Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
          <select
            value={filters.class_id}
            onChange={(e) => onFilterChange({ class_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">All Classes</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>

        {/* Course Filter */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
          <input
            type="text"
            placeholder="Enter course name"
            value={filters.course}
            onChange={(e) => onFilterChange({ course: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div> */}

        {/* Semester Filter */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
          <select
            value={filters.semester}
            onChange={(e) => onFilterChange({ semester: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">All Semesters</option>
            {semesters.map(sem => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
        </div> */}

        {/* Date From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
          <input
            type="date"
            value={filters.date_from}
            onChange={(e) => onFilterChange({ date_from: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
          <input
            type="date"
            value={filters.date_to}
            onChange={(e) => onFilterChange({ date_to: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Attendance Status */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Attendance Status</label>
          <select
            value={filters.attendance_status}
            onChange={(e) => onFilterChange({ attendance_status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            {attendanceStatuses.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div> */}
      </div>
    </div>
  );
};

export default FilterPanel;