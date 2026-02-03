from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, sessionmaker, and_, or_, func
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.ext.declarative import declarative_base
from datetime import date, datetime
from typing import Optional, List
import uuid
from pydantic import BaseModel, Field
from models.student import Student
from models.attendance import Attendance

app = FastAPI(title="Student Attendance API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup (you'll need to configure this with your actual database)
SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost/dbname"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models
class AttendanceResponse(BaseModel):
    id: int
    date: date
    status: str
    
    class Config:
        from_attributes = True

class StudentResponse(BaseModel):
    id: str
    roll_number: str
    full_name: str
    email: str
    phone: Optional[str]
    course: Optional[str]
    semester: Optional[str]
    gender: Optional[str]
    date_of_birth: Optional[date]
    department_id: Optional[str]
    class_id: Optional[str]
    organization_id: Optional[str]
    attendance_records: List[AttendanceResponse] = []
    total_present: int = 0
    total_absent: int = 0
    attendance_percentage: float = 0.0
    
    class Config:
        from_attributes = True

class StudentFilters(BaseModel):
    search: Optional[str] = None
    department_id: Optional[str] = None
    class_id: Optional[str] = None
    course: Optional[str] = None
    semester: Optional[str] = None
    date_from: Optional[date] = None
    date_to: Optional[date] = None
    attendance_status: Optional[str] = None
    organization_id: Optional[str] = None

@app.get("/api/students", response_model=List[StudentResponse])
async def get_students(
    search: Optional[str] = Query(None),
    department_id: Optional[str] = Query(None),
    class_id: Optional[str] = Query(None),
    course: Optional[str] = Query(None),
    semester: Optional[str] = Query(None),
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    attendance_status: Optional[str] = Query(None),
    organization_id: Optional[str] = Query(None),
    limit: int = Query(50, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """Get students with their attendance records and filtering options"""
    
    # Build the base query
    query = db.query(Student)
    
    # Apply filters
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Student.full_name.ilike(search_term),
                Student.roll_number.ilike(search_term),
                Student.email.ilike(search_term)
            )
        )
    
    if department_id:
        query = query.filter(Student.department_id == department_id)
    
    if class_id:
        query = query.filter(Student.class_id == class_id)
    
    if course:
        query = query.filter(Student.course.ilike(f"%{course}%"))
    
    if semester:
        query = query.filter(Student.semester == semester)
    
    if organization_id:
        query = query.filter(Student.organization_id == organization_id)
    
    # Get students
    students = query.offset(offset).limit(limit).all()
    
    # Prepare response data
    student_responses = []
    
    for student in students:
        # Build attendance query
        attendance_query = db.query(Attendance).filter(
            Attendance.student_id == student.id
        )
        
        # Apply date filters to attendance
        if date_from:
            attendance_query = attendance_query.filter(Attendance.date >= date_from)
        if date_to:
            attendance_query = attendance_query.filter(Attendance.date <= date_to)
        
        # Get attendance records
        attendance_records = attendance_query.all()
        
        # Filter by attendance status if specified
        if attendance_status:
            attendance_records = [
                record for record in attendance_records 
                if record.status.lower() == attendance_status.lower()
            ]
        
        # Calculate attendance statistics
        total_present = len([r for r in attendance_records if r.status.lower() == 'present'])
        total_absent = len([r for r in attendance_records if r.status.lower() == 'absent'])
        total_records = len(attendance_records)
        
        attendance_percentage = (total_present / total_records * 100) if total_records > 0 else 0
        
        # Create response object
        student_response = StudentResponse(
            id=str(student.id),
            roll_number=student.roll_number,
            full_name=student.full_name,
            email=student.email,
            phone=student.phone,
            course=student.course,
            semester=student.semester,
            gender=student.gender,
            date_of_birth=student.date_of_birth,
            department_id=str(student.department_id) if student.department_id else None,
            class_id=str(student.class_id) if student.class_id else None,
            organization_id=str(student.organization_id) if student.organization_id else None,
            attendance_records=[
                AttendanceResponse(
                    id=record.id,
                    date=record.date,
                    status=record.status
                ) for record in attendance_records
            ],
            total_present=total_present,
            total_absent=total_absent,
            attendance_percentage=round(attendance_percentage, 2)
        )
        
        student_responses.append(student_response)
    
    return student_responses

@app.get("/api/attendance/stats")
async def get_attendance_stats(
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    department_id: Optional[str] = Query(None),
    organization_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get attendance statistics"""
    
    # Build base query
    query = db.query(Attendance).join(Student)
    
    # Apply filters
    if date_from:
        query = query.filter(Attendance.date >= date_from)
    if date_to:
        query = query.filter(Attendance.date <= date_to)
    if department_id:
        query = query.filter(Student.department_id == department_id)
    if organization_id:
        query = query.filter(Student.organization_id == organization_id)
    
    # Get statistics
    total_records = query.count()
    present_count = query.filter(Attendance.status.ilike('present')).count()
    absent_count = query.filter(Attendance.status.ilike('absent')).count()
    
    overall_percentage = (present_count / total_records * 100) if total_records > 0 else 0
    
    return {
        "total_records": total_records,
        "present_count": present_count,
        "absent_count": absent_count,
        "overall_percentage": round(overall_percentage, 2)
    }

@app.get("/api/departments")
async def get_departments(db: Session = Depends(get_db)):
    """Get list of departments (you'll need to implement Department model)"""
    # This is a placeholder - you'll need to implement based on your Department model
    return [
        {"id": "dept1", "name": "Computer Science"},
        {"id": "dept2", "name": "Electronics"},
        {"id": "dept3", "name": "Mechanical"},
        {"id": "dept4", "name": "Civil"},
    ]

@app.get("/api/classes")
async def get_classes(db: Session = Depends(get_db)):
    """Get list of classes (you'll need to implement Class model)"""
    # This is a placeholder - you'll need to implement based on your Class model
    return [
        {"id": "class1", "name": "A"},
        {"id": "class2", "name": "B"},
        {"id": "class3", "name": "C"},
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)