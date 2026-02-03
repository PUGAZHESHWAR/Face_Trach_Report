import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, Phone, User, Calendar, CheckCircle, XCircle, BarChart3 } from 'lucide-react';
import { Student } from '../types';

interface StudentListProps {
  students: Student[];
  loading: boolean;
}

const StudentList: React.FC<StudentListProps> = ({ students, loading }) => {
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  const toggleExpand = (studentId: string) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 75) return 'text-green-600 bg-green-100';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusColor = (status: string) => {
    return status.toLowerCase() === 'present' 
      ? 'text-green-600 bg-green-100' 
      : 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students Found</h3>
        <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Students ({students.length})
        </h2>
      </div>

      {students.map((student) => (
        <div key={student.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
          <div 
            className="p-6 cursor-pointer"
            onClick={() => toggleExpand(student.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">{student.full_name}</h3>
                    <span className="text-sm text-gray-500">({student.roll_number})</span>
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600 flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {student.email}
                    </span>
                    {student.course && (
                      <span className="text-sm text-gray-600">
                        {student.course} {student.semester && `- Sem ${student.semester}`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAttendanceColor(student.attendance_percentage)}`}>
                    <BarChart3 className="w-4 h-4 mr-1" />
                    {student.attendance_percentage}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {student.total_present}P / {student.total_absent}A
                  </div>
                </div>
                {expandedStudent === student.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          {expandedStudent === student.id && (
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Student Details */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Student Details</h4>
                  <div className="space-y-3">
                    {student.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-gray-600">Phone:</span>
                        <span className="ml-2 text-gray-900">{student.phone}</span>
                      </div>
                    )}
                    {student.date_of_birth && (
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-gray-600">Date of Birth:</span>
                        <span className="ml-2 text-gray-900">{new Date(student.date_of_birth).toLocaleDateString()}</span>
                      </div>
                    )}
                    {student.gender && (
                      <div className="flex items-center text-sm">
                        <User className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-gray-600">Gender:</span>
                        <span className="ml-2 text-gray-900">{student.gender}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Attendance Records */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Recent Attendance</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {student.attendance_records.length > 0 ? (
                      student.attendance_records
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice(0, 10)
                        .map((record) => (
                          <div key={record.id} className="flex items-center justify-between p-3 bg-white rounded border">
                            <div className="flex items-center space-x-3">
                              {record.status.toLowerCase() === 'present' ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )}
                              <span className="text-sm font-medium text-gray-900">
                                {new Date(record.date).toLocaleDateString()}
                              </span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                              {record.status}
                            </span>
                          </div>
                        ))
                    ) : (
                      <div className="text-sm text-gray-500 text-center py-4">
                        No attendance records found
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StudentList;