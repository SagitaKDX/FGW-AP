import {
  ArrowRight,
  Award,
  Badge,
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  Clock,
  CreditCard,
  Download,
  Eye,
  FileText,
  Globe,
  GraduationCap,
  Heart,
  HelpCircle,
  Home,
  Info,
  LayoutGrid,
  List,
  MessageSquare,
  Newspaper,
  PauseCircle,
  QrCode,
  Receipt,
  RefreshCw,
  ScrollText,
  Search,
  Send,
  Shield,
  ShoppingCart,
  Star,
  TrendingUp,
  Upload,
  UserCheck,
  UserCircle,
  UserCog,
  Users,
  XCircle,
  Zap
} from 'lucide-react';
import { type MenuConfig, type MenuItem } from './types';

const isGreenwichPortal =
  typeof window !== 'undefined' &&
  window.location.hostname.includes('ap.greenwich.edu.vn');

const GREENWICH_ALLOWED_PATHS = new Set([
  '/',
  '/Student.aspx',
  '/CmsFAP/News.aspx',
  '/FrontOffice/RegisterCourse.aspx?code=R5',
  '/App/SendAcad.aspx',
  '/App/AcadAppView.aspx',
  '/App/AddApp.aspx',
  '/Feedback/StudentFeedBack.aspx',
  '/Course/Courses.aspx',
  '/Report/ScheduleOfWeek.aspx',
  '/Exam/ScheduleExams.aspx',
  '/FrontOffice/SubjectFees.aspx',
  '/Report/ViewAttendstudent.aspx',
  '/Grade/StudentGrade.aspx',
  '/Grade/StudentTranscript.aspx',
  '/FrontOffice/StudentCurriculum.aspx',
  '/Report/StudentFees.aspx',
  '/FrontOffice/WishList.aspx',
  '/User/Profile.aspx',
  '/User/verProfile.aspx',
  '/Course/Terms.aspx',
  '/Campus/Rooms.aspx',
  '/User/Regulations.aspx',
  '/Report/Help.aspx',
]);

const GREENWICH_BLOCKED_EXTERNAL_PREFIXES = [
  'http://',
  'https://',
];

const normalizePath = (path: string): string => {
  if (path.startsWith('http')) {
    return path;
  }
  return path.startsWith('/') ? path : `/${path}`;
};

const filterMenuItemsForGreenwich = (
  items: MenuConfig,
  level: number = 0,
): MenuConfig => {
  return items.reduce<MenuConfig>((acc, item) => {
    if (item.heading) {
      acc.push(item);
      return acc;
    }

    const newItem: MenuItem = { ...item };

    const normalizedPath = item.path ? normalizePath(item.path) : undefined;
    if (normalizedPath) {
      newItem.path = normalizedPath;
    }

    if (item.children) {
      const filteredChildren = filterMenuItemsForGreenwich(
        item.children,
        level + 1,
      );
      if (filteredChildren.length > 0) {
        newItem.children = filteredChildren;
      } else {
        delete newItem.children;
      }
    }

    const hasChildren =
      Array.isArray(newItem.children) && newItem.children.length > 0;
    const path = newItem.path;
    const isExternal =
      typeof path === 'string' &&
      GREENWICH_BLOCKED_EXTERNAL_PREFIXES.some((prefix) =>
        path.startsWith(prefix),
      );

    const isInternalButNotAllowed =
      typeof path === 'string' &&
      !isExternal &&
      !GREENWICH_ALLOWED_PATHS.has(path);

    if (isExternal || isInternalButNotAllowed || (!path && !hasChildren)) {
      if (level === 0) {
        acc.push({
          ...newItem,
          path: undefined,
          children: undefined,
          disabled: true,
        });
      }
      return acc;
    }

    if (typeof path === 'string' && !path.startsWith('http')) {
      newItem.path = path;
    }

    acc.push(newItem);
    return acc;
  }, []);
};

const filterMenuRootForGreenwich = (items: MenuConfig): MenuConfig => {
  return items.filter((item) => {
    if (!item.path) {
      return false;
    }
    const path = normalizePath(item.path);
    return GREENWICH_ALLOWED_PATHS.has(path);
  });
};

const FPT_MENU_SIDEBAR: MenuConfig = [
  {
    title: 'MENU.ACADEMIC_PORTAL',
    icon: LayoutGrid,
    children: [
      { title: 'MENU.HOME', path: '/' },
      { title: 'MENU.HOME', path: '/Student.aspx' },
      { title: 'MENU.NEWS', path: '/CmsFAP/News.aspx' },
    ],
  },
  { heading: 'MENU.MAIN' },
  {
    title: 'MENU.REGISTRATION_APPLICATION',
    icon: FileText,
    children: [
      {
        title: 'MENU.REGISTER_COURSE',
        children: [
          { title: 'MENU.REGISTER_COURSE_ABROAD', path: '/FrontOffice/RegisterCourse.aspx?code=R14' },
          { title: 'MENU.REGISTER_EXTRA_COURSES', path: '/FrontOffice/RegisterCourse.aspx?code=R3' },
          { title: 'MENU.REGISTER_IMPROVE_MARK', path: '/FrontOffice/RegisterCourse.aspx?code=R4' },
          { title: 'MENU.REGISTER_REPEAT_COURSE', path: '/FrontOffice/RegisterCourse.aspx?code=R5' },
          { title: 'MENU.REGISTER_FREE_ELECTIVE', path: '/FrontOffice/RegisterElective.aspx' },
          { title: 'MENU.REGISTER_FAST_TRACK', path: '/FrontOffice/RegisterCourseFast.aspx' },
          { title: 'MENU.REGISTER_TUTORING', path: '/FrontOffice/RegisterMore.aspx' },
          { title: 'MENU.CANCEL_REGISTRATION', path: '/FrontOffice/RegisteredCourses.aspx' },
          { title: 'MENU.WISHLIST_COURSE', path: '/FrontOffice/WishList.aspx' },
          { title: 'MENU.REGISTER_WISHLIST', path: '/FrontOffice/RegisterWishlish.aspx' },
          { title: 'MENU.REQUEST_CLASS_SWAP', path: '/App/CourseChange.aspx' },
          { title: 'MENU.MOVE_OUT_CLASS', path: '/FrontOffice/Courses.aspx' },
        ],
      },
      {
        title: 'MENU.SUSPEND_AND_CONFIRM',
        children: [
          { title: 'MENU.SUSPEND_ONE_SEMESTER_REPEAT', path: '/FrontOffice/AddApplication.aspx?code=R1' },
          { title: 'MENU.SUSPEND_ONE_SEMESTER', path: '/FrontOffice/AddApplication.aspx?code=R2' },
          { title: 'MENU.STUDENT_CONFIRMATION', path: '/App/AddApp.aspx' },
          { title: 'MENU.SEND_APPLICATION', path: '/App/SendAcad.aspx' },
          { title: 'MENU.VIEW_APPLICATION', path: '/App/AcadAppView.aspx' },
        ],
      },
      {
        title: 'MENU.OTHERS',
        children: [
          { title: 'MENU.INSURANCE_REGISTER', path: '/BHYT/Register.aspx' },
          { title: 'MENU.STARTUP_SUPPORT', path: '/SBA/Add.aspx' },
          { title: 'MENU.VIEW_STARTUP_SUPPORT', path: '/SBA/StudentSBA.aspx' },
          { title: 'MENU.ATTENDANCE_BY_CODE', path: '/Schedule/AttendanceByRoll.aspx' },
          { title: 'MENU.CHOOSE_PAID_ITEMS', path: '/FrontOffice/ShoppingCart.aspx' },
          { title: 'MENU.PAYMENT', path: '/FrontOffice/CheckOut.aspx' },
          { title: 'MENU.ORIENTATION_GUIDE', path: 'https://fap.fpt.edu.vn/temp/Regulations/Slide_OR_student.rar' },
          { title: 'MENU.UPGRADE_SEB', path: 'https://drive.google.com/drive/u/2/folders/1RmjeKAvef6BXg_qlAl6JnZx2ZkY3qj_3' },
        ],
      },
    ],
  },
  {
    title: 'MENU.LOOKUP',
    icon: Search,
    children: [
      {
        title: 'MENU.SCHEDULE_AND_EXAM',
        children: [
          { title: 'MENU.UNIVERSITY_TIMETABLE', path: '/Course/Courses.aspx' },
          { title: 'MENU.WEEKLY_TIMETABLE', path: '/Report/ScheduleOfWeek.aspx' },
          { title: 'MENU.VIEW_EXAM_SCHEDULE', path: '/Exam/ScheduleExams.aspx' },
          { title: 'MENU.STUDENT_BOOK_ROOM', path: '/Schedule/ActivityStudent.aspx' },
        ],
      },
      {
        title: 'MENU.TUITION_AND_SYLLABUS',
        children: [
          { title: 'MENU.TUITION_FEE_PER_COURSE', path: '/FrontOffice/SubjectFees.aspx' },
          { title: 'MENU.VIEW_SYLLABUSES', path: 'http://flm.fpt.edu.vn' },
          { title: 'MENU.EDUNEXT_GUIDE', path: 'https://fap.fpt.edu.vn/temp/Regulations/Huong_dan_KTXH_tren_EduNext_Sp23_Sinh_Vien.pdf' },
        ],
      },
    ],
  },
  {
    title: 'MENU.REPORTS',
    icon: FileText,
    children: [
      {
        title: 'MENU.STUDY_REPORT',
        children: [
          { title: 'MENU.ATTENDANCE_REPORT', path: '/Report/ViewAttendstudent.aspx' },
          { title: 'MENU.MARK_REPORT', path: '/Grade/StudentGrade.aspx' },
          { title: 'MENU.ACADEMIC_TRANSCRIPT', path: '/Grade/StudentTranscript.aspx' },
        ],
      },
      {
        title: 'MENU.FEEDBACK',
        children: [
          { title: 'MENU.FEEDBACK_TEACHING', path: '/Feedback/StudentFeedBack.aspx' },
        ],
      },
    ],
  },
  {
    title: 'MENU.INFORMATION',
    icon: Info,
    children: [
      {
        title: 'MENU.PERSONAL_INFORMATION',
        children: [
          { title: 'MENU.STUDENT_PROFILE', path: '/User/Profile.aspx' },
          { title: 'MENU.UPDATE_PROFILE', path: '/User/verProfile.aspx' },
          { title: 'MENU.VIEW_SEMESTER', path: '/Course/Terms.aspx' },
          { title: 'MENU.VIEW_ROOM', path: '/Campus/Rooms.aspx' },
        ],
      },
      {
        title: 'MENU.REGULATIONS',
        children: [
          { title: 'MENU.GENERAL_REGULATIONS', path: '/User/Regulations.aspx' },
          { title: 'MENU.DORMITORY_REGULATIONS_HANOI', path: 'https://fap.fpt.edu.vn/temp/Regulations/QD 272_new.pdf' },
          { title: 'MENU.DORMITORY_REGULATIONS_CANTHO', path: 'https://fap.fpt.edu.vn/temp/Regulations/KTXCT.pdf' },
          { title: 'MENU.DORMITORY_ON_CAMPUS', path: 'https://ocd.fpt.edu.vn/' },
        ],
      },
    ],
  },
  {
    title: 'MENU.COURSES_ON_COURSERA',
    icon: GraduationCap,
    children: [
      {
        title: 'MENU.INFORMATION_AND_GUIDE',
        children: [
          { title: 'MENU.ANNOUNCEMENT', path: 'https://fap.fpt.edu.vn/temp/Regulations/FPTU-Coursera.pdf' },
          { title: 'MENU.CERTIFICATE_GUIDE', path: 'https://fap.fpt.edu.vn/temp/Regulations/Coursera_certificates_submission_guidelines.pdf' },
          { title: 'MENU.WILEY_GUIDE', path: 'https://fap.fpt.edu.vn/temp/Regulations/How-to-access-Wiley-eBook-on-Vitalsource-platform_13_Jan_2025.pdf' },
        ],
      },
      {
        title: 'MENU.STUDY_SUPPORT',
        children: [
          { title: 'MENU.ASK_MENTOR', path: '/SRS/AddQA.aspx' },
          { title: 'MENU.VIEW_ANSWER', path: '/SRS/ViewQAS.aspx' },
          { title: 'MENU.SUBMIT_CERTIFICATES', path: 'https://insideuni.fpt.edu.vn/13' },
          { title: 'MENU.DOWNLOAD_EOSCLIENT', path: 'https://fap.fpt.edu.vn/temp/template/EOS_Client_Sinhvien.rar' },
        ],
      },
    ],
  },
];

const FPT_MENU_SIDEBAR_CUSTOM: MenuConfig = [
  {
    title: 'MENU.REGISTRATION_APPLICATION',
    icon: FileText,
    children: [
      {
        title: 'MENU.REGISTER_COURSE',
        children: [
          { title: 'MENU.REGISTER_COURSE_ABROAD', path: '/FrontOffice/RegisterCourse.aspx?code=R14' },
          { title: 'MENU.REGISTER_EXTRA_COURSES', path: '/FrontOffice/RegisterCourse.aspx?code=R3' },
          { title: 'MENU.REGISTER_IMPROVE_MARK', path: '/FrontOffice/RegisterCourse.aspx?code=R4' },
          { title: 'MENU.REGISTER_REPEAT_COURSE', path: '/FrontOffice/RegisterCourse.aspx?code=R5' },
          { title: 'MENU.REGISTER_FREE_ELECTIVE', path: '/FrontOffice/RegisterElective.aspx' },
          { title: 'MENU.REGISTER_FAST_TRACK', path: '/FrontOffice/RegisterCourseFast.aspx' },
          { title: 'MENU.REGISTER_TUTORING', path: '/FrontOffice/RegisterMore.aspx' },
        ],
      },
      {
        title: 'MENU.SUSPEND_AND_CONFIRM',
        children: [
          { title: 'MENU.SUSPEND_ONE_SEMESTER_REPEAT', path: '/FrontOffice/AddApplication.aspx?code=R1' },
          { title: 'MENU.SUSPEND_ONE_SEMESTER', path: '/FrontOffice/AddApplication.aspx?code=R2' },
          { title: 'MENU.STUDENT_CONFIRMATION', path: '/App/AddApp.aspx' },
        ],
      },
    ],
  },
];

const FPT_MENU_SIDEBAR_COMPACT: MenuConfig = [
  {
    title: 'MENU.HOME',
    icon: LayoutGrid,
    path: '/',
  },
  {
    title: 'MENU.NEWS',
    icon: Newspaper,
    path: '/CmsFAP/News.aspx',
  },
  {
    title: 'MENU.REGISTRATION_APPLICATION',
    icon: FileText,
    children: [
      {
        title: 'MENU.REGISTER_COURSE',
        children: [
          { title: 'MENU.REGISTER_COURSE_ABROAD', path: '/FrontOffice/RegisterCourse.aspx?code=R14' },
          { title: 'MENU.REGISTER_EXTRA_COURSES', path: '/FrontOffice/RegisterCourse.aspx?code=R3' },
          { title: 'MENU.REGISTER_IMPROVE_MARK', path: '/FrontOffice/RegisterCourse.aspx?code=R4' },
          { title: 'MENU.REGISTER_REPEAT_COURSE', path: '/FrontOffice/RegisterCourse.aspx?code=R5' },
          { title: 'MENU.REGISTER_FREE_ELECTIVE', path: '/FrontOffice/RegisterElective.aspx' },
        ],
      },
      {
        title: 'MENU.SUSPEND_AND_CONFIRM',
        children: [
          { title: 'MENU.SUSPEND_ONE_SEMESTER_REPEAT', path: '/FrontOffice/AddApplication.aspx?code=R1' },
          { title: 'MENU.SUSPEND_ONE_SEMESTER', path: '/FrontOffice/AddApplication.aspx?code=R2' },
          { title: 'MENU.STUDENT_CONFIRMATION', path: '/App/AddApp.aspx' },
        ],
      },
    ],
  },
  {
    title: 'MENU.LOOKUP',
    icon: Search,
    children: [
      {
        title: 'MENU.SCHEDULE_AND_EXAM',
        children: [
          { title: 'MENU.UNIVERSITY_TIMETABLE', path: '/Course/Courses.aspx' },
          { title: 'MENU.WEEKLY_TIMETABLE', path: '/Report/ScheduleOfWeek.aspx' },
          { title: 'MENU.VIEW_EXAM_SCHEDULE', path: '/Exam/ScheduleExams.aspx' },
        ],
      },
    ],
  },
  {
    title: 'MENU.REPORTS',
    icon: FileText,
    children: [
      {
        title: 'MENU.STUDY_REPORT',
        children: [
          { title: 'MENU.ATTENDANCE_REPORT', path: '/Report/ViewAttendstudent.aspx' },
          { title: 'MENU.MARK_REPORT', path: '/Grade/StudentGrade.aspx' },
          { title: 'MENU.ACADEMIC_TRANSCRIPT', path: '/Grade/StudentTranscript.aspx' },
        ],
      },
    ],
  },
];

const FPT_MENU_MEGA: MenuConfig = [
  { title: 'MENU.HOME', path: '/Student.aspx' },
  { title: 'MENU.NEWS', path: '/CmsFAP/News.aspx' },
  {
    title: 'MENU.REGISTRATION_APPLICATION',
    children: [
      {
        title: 'MENU.REGISTER_COURSE',
        children: [
          {
            children: [
              { title: 'MENU.REGISTER_COURSE_ABROAD', icon: Globe, path: '/FrontOffice/RegisterCourse.aspx?code=R14' },
              { title: 'MENU.REGISTER_EXTRA_COURSES', icon: Clock, path: '/FrontOffice/RegisterCourse.aspx?code=R3' },
              { title: 'MENU.REGISTER_IMPROVE_MARK', icon: TrendingUp, path: '/FrontOffice/RegisterCourse.aspx?code=R4' },
              { title: 'MENU.REGISTER_REPEAT_COURSE', icon: RefreshCw, path: '/FrontOffice/RegisterCourse.aspx?code=R5' },
              { title: 'MENU.REGISTER_FREE_ELECTIVE', icon: BookOpen, path: '/FrontOffice/RegisterElective.aspx' },
              { title: 'MENU.REGISTER_FAST_TRACK', icon: Zap, path: '/FrontOffice/RegisterCourseFast.aspx' },
              { title: 'MENU.REGISTER_TUTORING', icon: GraduationCap, path: '/FrontOffice/RegisterMore.aspx' },
            ],
          },
          {
            children: [
              { title: 'MENU.CANCEL_REGISTRATION', icon: XCircle, path: '/FrontOffice/RegisteredCourses.aspx' },
              { title: 'MENU.WISHLIST_COURSE', icon: List, path: '/FrontOffice/WishList.aspx' },
              { title: 'MENU.REGISTER_WISHLIST', icon: ClipboardCheck, path: '/FrontOffice/RegisterWishlish.aspx' },
              { title: 'MENU.REQUEST_CLASS_SWAP', icon: Users, path: '/App/CourseChange.aspx' },
              { title: 'MENU.MOVE_OUT_CLASS', icon: ArrowRight, path: '/FrontOffice/Courses.aspx' },
            ],
          },
        ],
      },
      {
        title: 'MENU.SUSPEND_AND_CONFIRM',
        children: [
          {
            children: [
              { title: 'MENU.SUSPEND_ONE_SEMESTER_REPEAT', icon: PauseCircle, path: '/FrontOffice/AddApplication.aspx?code=R1' },
              { title: 'MENU.SUSPEND_ONE_SEMESTER', icon: Calendar, path: '/FrontOffice/AddApplication.aspx?code=R2' },
              { title: 'MENU.STUDENT_CONFIRMATION', icon: UserCheck, path: '/App/AddApp.aspx' },
              { title: 'MENU.SEND_APPLICATION', icon: Send, path: '/App/SendAcad.aspx' },
              { title: 'MENU.VIEW_APPLICATION', icon: Eye, path: '/App/AcadAppView.aspx' },
            ],
          },
        ],
      },
      {
        title: 'MENU.OTHERS',
        children: [
          {
            children: [
              { title: 'MENU.INSURANCE_REGISTER', icon: Heart, path: '/BHYT/Register.aspx' },
              { title: 'MENU.STARTUP_SUPPORT', icon: Briefcase, path: '/SBA/Add.aspx' },
              { title: 'MENU.VIEW_STARTUP_SUPPORT', icon: FileText, path: '/SBA/StudentSBA.aspx' },
              { title: 'MENU.ATTENDANCE_BY_CODE', icon: QrCode, path: '/Schedule/AttendanceByRoll.aspx' },
              { title: 'MENU.CHOOSE_PAID_ITEMS', icon: ShoppingCart, path: '/FrontOffice/ShoppingCart.aspx' },
              { title: 'MENU.PAYMENT', icon: CreditCard, path: '/FrontOffice/CheckOut.aspx' },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'MENU.LOOKUP',
    children: [
      {
        title: 'MENU.SCHEDULE_AND_EXAM',
        children: [
          {
            children: [
              { title: 'MENU.UNIVERSITY_TIMETABLE', icon: Calendar, path: '/Course/Courses.aspx' },
              { title: 'MENU.WEEKLY_TIMETABLE', icon: CalendarDays, path: '/Report/ScheduleOfWeek.aspx' },
              { title: 'MENU.VIEW_EXAM_SCHEDULE', icon: ClipboardList, path: '/Exam/ScheduleExams.aspx' },
              { title: 'MENU.STUDENT_BOOK_ROOM', icon: Building2, path: '/Schedule/ActivityStudent.aspx' },
            ],
          },
        ],
      },
      {
        title: 'MENU.TUITION_AND_SYLLABUS',
        children: [
          {
            children: [
              { title: 'MENU.TUITION_FEE_PER_COURSE', icon: Receipt, path: '/FrontOffice/SubjectFees.aspx' },
              { title: 'MENU.VIEW_SYLLABUSES', icon: BookOpen, path: 'http://flm.fpt.edu.vn' },
              { title: 'MENU.EDUNEXT_GUIDE', icon: GraduationCap, path: 'https://fap.fpt.edu.vn/temp/Regulations/Huong_dan_KTXH_tren_EduNext_Sp23_Sinh_Vien.pdf' },
            ],
          },
        ],
      },
      {
        title: 'MENU.RESULTS_AND_SUPPORT',
        children: [
          {
            children: [
              { title: 'MENU.OJT', icon: Briefcase, path: '/App/ViewOjtCas.aspx' },
              { title: 'MENU.GRADUATION_THESIS', icon: Award, path: '/App/ViewXetTN.aspx' },
              { title: 'MENU.HELP', icon: HelpCircle, path: '/Report/Help.aspx' },
              { title: 'MENU.UPGRADE_SEB', icon: Shield, path: 'https://drive.google.com/drive/u/2/folders/1RmjeKAvef6BXg_qlAl6JnZx2ZkY3qj_3' },
              { title: 'MENU.ORIENTATION_GUIDE', icon: FileText, path: 'https://fap.fpt.edu.vn/temp/Regulations/Slide_OR_student.rar' },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'MENU.REPORTS',
    children: [
      {
        title: 'MENU.STUDY_REPORT',
        children: [
          {
            children: [
              { title: 'MENU.ATTENDANCE_REPORT', icon: ClipboardCheck, path: '/Report/ViewAttendstudent.aspx' },
              { title: 'MENU.MARK_REPORT', icon: Award, path: '/Grade/StudentGrade.aspx' },
              { title: 'MENU.ACADEMIC_TRANSCRIPT', icon: ScrollText, path: '/Grade/StudentTranscript.aspx' },
              { title: 'MENU.CURRICULUM', icon: BookOpen, path: '/FrontOffice/StudentCurriculum.aspx' },
              { title: 'MENU.TRANSACTION_HISTORY', icon: Receipt, path: '/Finance/TransReport.aspx' },
              { title: 'MENU.CERTIFICATES', icon: Badge, path: '/Report/Awa.aspx' },
              { title: 'MENU.REPORT_MOVEMENT_SCORE', icon: Star, path: '/Report/PrintReportFinalS.aspx' },
            ],
          },
        ],
      },
      {
        title: 'MENU.FEEDBACK',
        children: [
          {
            children: [
              { title: 'MENU.FEEDBACK_TEACHING', icon: MessageSquare, path: '/Feedback/StudentFeedBack.aspx' },
            ],
          },
        ],
      }
    ],
  },
  {
    title: 'MENU.INFORMATION',
    children: [
      {
        title: 'MENU.PERSONAL_INFORMATION',
        children: [
          {
            children: [
              { title: 'MENU.STUDENT_PROFILE', icon: UserCircle, path: '/User/Profile.aspx' },
              { title: 'MENU.UPDATE_PROFILE', icon: UserCog, path: '/User/verProfile.aspx' },
              { title: 'MENU.VIEW_SEMESTER', icon: Calendar, path: '/Course/Terms.aspx' },
              { title: 'MENU.VIEW_ROOM', icon: Building2, path: '/Campus/Rooms.aspx' },
            ],
          },
        ],
      },
      {
        title: 'MENU.REGULATIONS',
        children: [
          {
            children: [
              { title: 'MENU.GENERAL_REGULATIONS', icon: FileText, path: '/User/Regulations.aspx' },
              { title: 'MENU.DORMITORY_REGULATIONS_HANOI', icon: Home, path: 'https://fap.fpt.edu.vn/temp/Regulations/QD 272_new.pdf' },
              { title: 'MENU.DORMITORY_REGULATIONS_CANTHO', icon: Home, path: 'https://fap.fpt.edu.vn/temp/Regulations/KTXCT.pdf' },
              { title: 'MENU.DORMITORY_ON_CAMPUS', icon: Building2, path: 'https://ocd.fpt.edu.vn/' },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'MENU.COURSES_ON_COURSERA',
    children: [
      {
        title: 'MENU.INFORMATION_AND_GUIDE',
        children: [
          {
            children: [
              { title: 'MENU.ANNOUNCEMENT', icon: Bell, path: 'https://fap.fpt.edu.vn/temp/Regulations/FPTU-Coursera.pdf' },
              { title: 'MENU.CERTIFICATE_GUIDE', icon: FileText, path: 'https://fap.fpt.edu.vn/temp/Regulations/Coursera_certificates_submission_guidelines.pdf' },
              { title: 'MENU.WILEY_GUIDE', icon: BookOpen, path: 'https://fap.fpt.edu.vn/temp/Regulations/How-to-access-Wiley-eBook-on-Vitalsource-platform_13_Jan_2025.pdf' },
            ],
          },
        ],
      },
      {
        title: 'MENU.STUDY_SUPPORT',
        children: [
          {
            children: [
              { title: 'MENU.ASK_MENTOR', icon: MessageSquare, path: '/SRS/AddQA.aspx' },
              { title: 'MENU.VIEW_ANSWER', icon: Eye, path: '/SRS/ViewQAS.aspx' },
              { title: 'MENU.SUBMIT_CERTIFICATES', icon: Upload, path: 'https://insideuni.fpt.edu.vn/13' },
              { title: 'MENU.DOWNLOAD_EOSCLIENT', icon: Download, path: 'https://fap.fpt.edu.vn/temp/template/EOS_Client_Sinhvien.rar' },
            ],
          },
        ],
      },
    ],
  },
];

const FPT_MENU_MEGA_MOBILE: MenuConfig = [
  { title: 'MENU.HOME', path: '/Student.aspx' },
  {
    title: 'MENU.REGISTRATION_APPLICATION',
    children: [
      {
        title: 'MENU.REGISTER_COURSE',
        children: [
          { title: 'MENU.REGISTER_COURSE_ABROAD', path: '/FrontOffice/RegisterCourse.aspx?code=R14' },
          { title: 'MENU.REGISTER_EXTRA_COURSES', path: '/FrontOffice/RegisterCourse.aspx?code=R3' },
          { title: 'MENU.REGISTER_IMPROVE_MARK', path: '/FrontOffice/RegisterCourse.aspx?code=R4' },
          { title: 'MENU.REGISTER_REPEAT_COURSE', path: '/FrontOffice/RegisterCourse.aspx?code=R5' },
          { title: 'MENU.REGISTER_FREE_ELECTIVE', path: '/FrontOffice/RegisterElective.aspx' },
        ],
      },
      {
        title: 'MENU.SUSPEND_AND_CONFIRM',
        children: [
          { title: 'MENU.SUSPEND_ONE_SEMESTER_REPEAT', path: '/FrontOffice/AddApplication.aspx?code=R1' },
          { title: 'MENU.SUSPEND_ONE_SEMESTER', path: '/FrontOffice/AddApplication.aspx?code=R2' },
          { title: 'MENU.STUDENT_CONFIRMATION', path: '/App/AddApp.aspx' },
        ],
      },
    ],
  },
  {
    title: 'MENU.LOOKUP',
    children: [
      {
        title: 'MENU.SCHEDULE_AND_EXAM',
        children: [
          { title: 'MENU.UNIVERSITY_TIMETABLE', path: '/Course/Courses.aspx' },
          { title: 'MENU.WEEKLY_TIMETABLE', path: '/Report/ScheduleOfWeek.aspx' },
          { title: 'MENU.VIEW_EXAM_SCHEDULE', path: '/Exam/ScheduleExams.aspx' },
        ],
      },
    ],
  },
  {
    title: 'MENU.REPORTS',
    children: [
      {
        title: 'MENU.STUDY_REPORT',
        children: [
          { title: 'MENU.ATTENDANCE_REPORT', path: '/Report/ViewAttendstudent.aspx' },
          { title: 'MENU.MARK_REPORT', path: '/Grade/StudentGrade.aspx' },
          { title: 'MENU.ACADEMIC_TRANSCRIPT', path: '/Grade/StudentTranscript.aspx' },
        ],
      },
    ],
  },
];

const FPT_MENU_HELP: MenuConfig = [
  {
    title: 'MENU.HELP',
    icon: HelpCircle,
    path: '/Report/Help.aspx',
  },
  {
    title: 'MENU.EDUNEXT_GUIDE',
    icon: GraduationCap,
    path: 'https://fap.fpt.edu.vn/temp/Regulations/Huong_dan_KTXH_tren_EduNext_Sp23_Sinh_Vien.pdf',
  },
  {
    title: 'MENU.ORIENTATION_GUIDE',
    icon: FileText,
    path: 'https://fap.fpt.edu.vn/temp/Regulations/Slide_OR_student.rar',
  },
  {
    title: 'MENU.DORMITORY_REGULATIONS',
    icon: Home,
    children: [
      {
        title: 'MENU.DORMITORY_REGULATIONS_HANOI',
        path: 'https://fap.fpt.edu.vn/temp/Regulations/QD 272_new.pdf',
      },
      {
        title: 'MENU.DORMITORY_REGULATIONS_CANTHO',
        path: 'https://fap.fpt.edu.vn/temp/Regulations/KTXCT.pdf',
      },
    ],
  },
];

const FPT_MENU_ROOT: MenuConfig = [
  {
    title: 'MENU.REGISTRATION_APPLICATION',
    icon: FileText,
    rootPath: '/FrontOffice/',
    path: '/FrontOffice/RegisterCourse.aspx?code=R14',
    childrenIndex: 1,
  },
  {
    title: 'MENU.LOOKUP',
    icon: Search,
    rootPath: '/Course/',
    path: '/Course/Courses.aspx',
    childrenIndex: 2,
  },
  {
    title: 'MENU.REPORTS',
    icon: FileText,
    rootPath: '/Report/',
    path: '/Report/ViewAttendstudent.aspx',
    childrenIndex: 3,
  },
  {
    title: 'MENU.INFORMATION',
    icon: Info,
    rootPath: '/User/',
    path: '/User/Profile.aspx',
    childrenIndex: 4,
  },
  {
    title: 'MENU.COURSES_ON_COURSERA',
    icon: GraduationCap,
    rootPath: '/SRS/',
    path: '/SRS/AddQA.aspx',
    childrenIndex: 5,
  },
];

const ensureMegaMenuStructure = (items: MenuConfig): MenuConfig => {
  const map = new Map<string, MenuItem>();
  items.forEach((item) => {
    if (item.title) {
      map.set(item.title, item);
    }
  });

  const createPlaceholder = (title: string): MenuItem => ({
    title,
    disabled: true,
    children: [],
  });

  const getItem = (title: string): MenuItem => {
    const existing = map.get(title);
    if (existing) {
      return {
        ...existing,
        children: existing.children ?? [],
      };
    }
    return createPlaceholder(title);
  };

  return [
    getItem('MENU.HOME'),
    getItem('MENU.NEWS'),
    getItem('MENU.REGISTRATION_APPLICATION'),
    getItem('MENU.LOOKUP'),
    getItem('MENU.REPORTS'),
    getItem('MENU.INFORMATION'),
    getItem('MENU.COURSES_ON_COURSERA'),
  ];
};

const GREENWICH_MENU_SIDEBAR: MenuConfig =
  filterMenuItemsForGreenwich(FPT_MENU_SIDEBAR);

const GREENWICH_MENU_SIDEBAR_CUSTOM: MenuConfig =
  filterMenuItemsForGreenwich(FPT_MENU_SIDEBAR_CUSTOM);

const GREENWICH_MENU_SIDEBAR_COMPACT: MenuConfig =
  filterMenuItemsForGreenwich(FPT_MENU_SIDEBAR_COMPACT);

const GREENWICH_MENU_MEGA: MenuConfig = ensureMegaMenuStructure(
  filterMenuItemsForGreenwich(FPT_MENU_MEGA),
);

const GREENWICH_MENU_MEGA_MOBILE: MenuConfig = filterMenuItemsForGreenwich(
  FPT_MENU_MEGA_MOBILE,
);

const GREENWICH_MENU_HELP: MenuConfig = filterMenuItemsForGreenwich(
  FPT_MENU_HELP,
);

const GREENWICH_MENU_ROOT: MenuConfig =
  filterMenuRootForGreenwich(FPT_MENU_ROOT);

export const MENU_SIDEBAR: MenuConfig = isGreenwichPortal
  ? GREENWICH_MENU_SIDEBAR
  : FPT_MENU_SIDEBAR;

export const MENU_SIDEBAR_CUSTOM: MenuConfig = isGreenwichPortal
  ? GREENWICH_MENU_SIDEBAR_CUSTOM
  : FPT_MENU_SIDEBAR_CUSTOM;

export const MENU_SIDEBAR_COMPACT: MenuConfig = isGreenwichPortal
  ? GREENWICH_MENU_SIDEBAR_COMPACT
  : FPT_MENU_SIDEBAR_COMPACT;

export const MENU_MEGA: MenuConfig = isGreenwichPortal
  ? GREENWICH_MENU_MEGA
  : FPT_MENU_MEGA;

export const MENU_MEGA_MOBILE: MenuConfig = isGreenwichPortal
  ? GREENWICH_MENU_MEGA_MOBILE
  : FPT_MENU_MEGA_MOBILE;

export const MENU_HELP: MenuConfig = isGreenwichPortal
  ? GREENWICH_MENU_HELP
  : FPT_MENU_HELP;

export const MENU_ROOT: MenuConfig = isGreenwichPortal
  ? GREENWICH_MENU_ROOT
  : FPT_MENU_ROOT;

