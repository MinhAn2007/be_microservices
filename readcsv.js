const connect = require("./UserService/database/db.js");
const User = require("./UserService/models/user.js");
connect();

const currentStudentData = {
  student_id: "123456",
  code: "S001",
  full_name: "Nguyễn Văn A",
  date_of_birth: new Date("2000-01-01"),
  gender: "Male",
  address: "123 Đường ABC, Quận XYZ, Thành phố HCM",
  phone: "0123456789",
  email: "nguyenvana@example.com",
  avatar: "avatar.jpg",
  major: "Computer Science",
  faculty: "Faculty of Information Technology",
  registrations: [
    {
      semester: "Spring 2024",
      registered_credits: 12,
    },
  ],
  credits_earned: 30,
  gpa: 3.5,
  courses: [
    {
      course_id: "CSE101",
      course_name: "Introduction to Computer Science",
      credits: 3,
      grade: "A",
    },
    // Thêm các khóa học khác nếu cần
  ],
};

// Dữ liệu mẫu cho sinh viên đã tốt nghiệp
const graduatedStudentData = {
  student_id: "789012",
  code: "S002",
  full_name: "Trần Thị B",
  date_of_birth: new Date("2000-02-02"),
  gender: "Female",
  address: "456 Đường XYZ, Quận ABC, Thành phố HCM",
  phone: "0987654321",
  email: "tranthib@example.com",
  avatar: "avatar.jpg",
  major: "Information Technology",
  faculty: "Faculty of Computer Science",
  registrations: [],
  credits_earned: 120,
  gpa: 3.8,
  courses: [
    {
      course_id: "CSE101",
      course_name: "Introduction to Computer Science",
      credits: 3,
      grade: "A",
    },
    // Thêm các khóa học khác nếu cần
  ],
  graduated: true,
  graduation_date: new Date("2024-05-30"),
  degree_info: {
    degree_title: "Bachelor of Science",
    graduation_status: "Completed",
    completed_courses: [
      {
        course_id: "CSE101",
        course_name: "Introduction to Computer Science",
        credits: 3,
        grade: "A",
      },
      // Thêm các khóa học đã hoàn thành khác nếu cần
    ],
  },
  post_graduation_activities: [
    {
      activity_type: "Employment",
      details: "Software Engineer at Example Company",
      date: new Date("2024-06-01"),
    },
    // Thêm các hoạt động sau tốt nghiệp khác nếu cần
  ],
};

// Dữ liệu mẫu cho admin
const adminData = {
  code: "12345678",
  student_id: "12345678",
  full_name: "Admin", // Giá trị rỗng cho trường full_name
  date_of_birth: null, // Giá trị mặc định cho trường date_of_birth
  gender: " ", // Giá trị rỗng cho trường gender
  address: " ", // Giá trị rỗng cho trường address
  phone: " ", // Giá trị rỗng cho trường phone
  email: " ", // Giá trị rỗng cho trường email
  avatar: null, // Giá trị mặc định cho trường avatar
  major: " ", // Giá trị rỗng cho trường major
  faculty: " ", // Giá trị rỗng cho trường faculty
  registrations: [], // Mảng rỗng cho trường registrations
  credits_earned: 0, // Giá trị mặc định cho trường credits_earned
  gpa: 0, // Giá trị mặc định cho trường gpa
  courses: [], // Mảng rỗng cho trường courses
  registration: [], // Mảng rỗng cho trường registration
  graduated: false, // Giá trị mặc định cho trường graduated
  graduation_date: null, // Giá trị mặc định cho trường graduation_date
  degree_info: {
    degree_title: " ", // Giá trị rỗng cho trường degree_title
    graduation_status: " ", // Giá trị rỗng cho trường graduation_status
    completed_courses: [], // Mảng rỗng cho trường completed_courses
  },
  post_graduation_activities: [], // Mảng rỗng cho trường post_graduation_activities
  can_use_info: false, // Giá trị mặc định cho trường can_use_info
};

User.create(adminData).then((student) => {
  console.log("Current student created:", student);
});

