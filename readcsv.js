const mongoose = require('mongoose');
const Course = require('./RegistrationService/models/course');

// Kết nối đến cơ sở dữ liệu MongoDB
const connect = require('./RegistrationService/database/db.js');
connect();

    // Dữ liệu mẫu
    const coursesData = [
      {
        course_id: 'CSE101',
        name: 'Introduction to Computer Science',
        department: 'Computer Science',
        credits: 3,
        max_students: 50,
        is_chosen: true,
        prerequisites: [],
        classes: [
          {
            class_id: 'CSE101-01',
            schedule: 'Mon/Wed/Fri 9:00-10:30 AM',
            instructor: 'Dr. Smith',
            current_students: 30,
            schedule_theory: 'Mon/Wed 9:00-10:30 AM',
            schedule_lab: 'Thu 1:00-4:00 PM'
          },
          {
            class_id: 'CSE101-02',
            schedule: 'Tue/Thu 1:00-2:30 PM',
            instructor: 'Prof. Johnson',
            current_students: 25,
            schedule_theory: 'Tue/Thu 1:00-2:30 PM',
            schedule_lab: 'Fri 9:00 AM-12:00 PM'
          }
        ]
      },
      // Môn học 2: Data Structures
      {
        course_id: 'CSE102',
        name: 'Data Structures',
        department: 'Computer Science',
        credits: 4,
        max_students: 40,
        is_chosen: true,
        prerequisites: ['CSE101'],
        classes: [
          {
            class_id: 'CSE102-01',
            schedule: 'Tue/Thu 10:00-11:30 AM',
            instructor: 'Prof. Johnson',
            current_students: 25,
            schedule_theory: 'Tue/Thu 10:00-11:30 AM',
            schedule_lab: 'Wed 1:00-4:00 PM'
          },
          {
            class_id: 'CSE102-02',
            schedule: 'Mon/Wed/Fri 1:00-2:30 PM',
            instructor: 'Prof. Johnson',
            current_students: 20,
            schedule_theory: 'Mon/Wed 1:00-2:30 PM',
            schedule_lab: 'Thu 9:00 AM-12:00 PM'
          },
        ]
      },
      {
        course_id: 'CSE103',
        name: 'Introduction to Programming',
        department: 'Computer Science',
        credits: 3,
        max_students: 40,
        is_chosen: true,
        prerequisites: [],
        classes: [
          {
            class_id: 'CSE103-01',
            schedule: 'Mon/Wed/Fri 9:00-10:30 AM',
            instructor: 'Dr. Smith',
            current_students: 30,
            schedule_theory: 'Mon/Wed 9:00-10:30 AM',
            schedule_lab: 'Thu 1:00-4:00 PM'
          },
          {
            class_id: 'CSE103-02',
            schedule: 'Tue/Thu 1:00-2:30 PM',
            instructor: 'Prof. Johnson',
            current_students: 25,
            schedule_theory: 'Tue/Thu 1:00-2:30 PM',
            schedule_lab: 'Fri 9:00 AM-12:00 PM'
          }
        ]
      }
    ];

    // Ghi dữ liệu vào cơ sở dữ liệu
    Course.insertMany(coursesData)
      .then((result) => {
        console.log('Data inserted successfully:', result);
      })
      .catch((err) => {
        console.error('Error inserting data:', err);
      });
