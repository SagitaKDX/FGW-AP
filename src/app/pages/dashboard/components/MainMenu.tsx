import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent } from '@/app/components/ui/card';
import { Link } from 'react-router';

interface MenuLink {
    title: string;
    href: string;
    cancelHref?: string;
    isNew?: boolean;
    target?: string;
    description?: string;
}

interface MenuSection {
    title: string;
    links: MenuLink[];
}

const MainMenu = () => {
    const menuSections: Record<string, MenuSection[]> = {
        'col1': [
            {
                title: 'Registration/Application (Thủ tục/đơn từ)',
                links: [
                    {
                        title: 'Suspend one semester to take repeated course',
                        href: 'FrontOffice/AddApplication.aspx?code=R1',
                        cancelHref: 'FrontOffice/RemoveApplication.aspx?code=R1',
                        description: 'Xin tạm hoãn tiến độ một học kỳ để học lại | Hủy bỏ việc xin tạm hoãn'
                    },
                    {
                        title: 'Suspend one semester',
                        href: 'FrontOffice/AddApplication.aspx?code=R2',
                        cancelHref: 'FrontOffice/RemoveApplication.aspx?code=R2',
                        description: 'Xin tạm nghỉ một học kỳ | Hủy bỏ việc xin tạm nghỉ'
                    },
                    { title: 'Move out class', href: 'FrontOffice/Courses.aspx', description: 'Xin chuyển lớp' },
                    { title: 'Send Application', href: 'App/SendAcad.aspx', description: 'Gửi đơn' },
                    { title: 'View Application', href: 'App/AcadAppView.aspx', description: 'Xem đơn' },
                    { title: 'Xin xác nhận sinh viên', href: 'App/AddApp.aspx' },
                    { title: 'Choose paid items', href: 'FrontOffice/ShoppingCart.aspx', description: 'Lựa chọn các khoản nộp' },
                    { title: 'Thanh toán', href: 'FrontOffice/CheckOut.aspx' }
                ]
            },
            {
                title: 'Feedback (Ý kiến)',
                links: [
                    { title: 'Feedback about teaching', href: 'Feedback/StudentFeedBack.aspx', description: 'Ý kiến về việc giảng dạy' }
                ]
            },
            {
                title: 'Others (Khác)',
                links: [
                    { title: 'Student Profile', href: 'User/Profile.aspx' },
                    { title: 'Update Profile', href: 'User/verProfile.aspx' },
                    { title: 'View semester', href: 'Course/Terms.aspx' },
                    { title: 'View room', href: 'Campus/Rooms.aspx', description: 'Xem thông tin về học kỳ, phòng' }
                ]
            },
        ],
        'col2': [
            {
                title: 'Information Access (Tra cứu thông tin)',
                links: [
                    { title: 'University timetable', href: 'Course/Courses.aspx', description: 'Lịch học' },
                    { title: 'Tuition fee per course', href: 'FrontOffice/SubjectFees.aspx', description: 'Biểu học phí' },
                    { title: 'Weekly timetable', href: 'Report/ScheduleOfWeek.aspx', description: 'Thời khóa biểu từng tuần' },
                    {
                        title: 'View exam schedule',
                        href: 'Exam/ScheduleExams.aspx',
                        description: 'Xem lịch thi'
                    },
                    {
                        title: 'Help/Hỗ trợ',
                        href: 'Report/Help.aspx',
                        isNew: true,
                    },
                    {
                        title: 'Student book room',
                        href: 'Schedule/ActivityStudent.aspx',
                        isNew: true
                    },
                    { title: 'OJT', href: 'App/ViewOjtCas.aspx', target: '_blank' },
                    { title: 'Xét khóa luận tốt nghiệp', href: 'App/ViewXetTN.aspx', target: '_blank' }
                ]
            },
            {
                title: 'Reports (Báo cáo)',
                links: [
                    { title: 'Attendance report', href: 'Report/ViewAttendstudent.aspx', description: 'Báo cáo điểm danh' },
                    { title: 'Mark Report', href: 'Grade/StudentGrade.aspx', description: 'Báo cáo điểm' },
                    { title: 'Academic Transcript', href: 'Grade/StudentTranscript.aspx', description: 'Bảng điểm' },
                    { title: 'Curriculum', href: 'FrontOffice/StudentCurriculum.aspx', description: 'Khung chương trình' },
                    { title: 'Transaction history', href: 'Finance/TransReport.aspx', description: 'Lịch sử giao dịch' }
                ]
            },
            {
                title: 'Regulations (Các quy định)',
                links: [
                    { title: 'Regulations...', href: 'User/Regulations.aspx', target: '_blank' }
                ]
            }
        ]
    };

    const renderLink = (link: MenuLink) => (
        <div className="flex items-center flex-wrap">
            <Link
                to={link.href.startsWith('http') ? link.href : `/${link.href}`}
                target={link.target}
                className="text-primary hover:text-primary-active hover:underline dark:text-white"
            >
                {link.title}
            </Link>
            {link.cancelHref && (
                <>
                    <span className="mx-1">|</span>
                    <Link
                        to={link.cancelHref.startsWith('http') ? link.cancelHref : `/${link.cancelHref}`}
                        className="text-primary hover:text-primary-active hover:underline dark:text-white"
                    >
                        Cancel
                    </Link>
                </>
            )}
            {link.isNew && (
                <Badge variant="destructive" className="ml-1 py-0 h-4 bg-red-50 text-red-500 border-red-200">
                    New
                </Badge>
            )}
            {link.description && (
                <span className="text-gray-600 dark:text-gray-500 ml-1">({link.description})</span>
            )}
        </div>
    );

    const renderSection = (section: MenuSection) => (
        <div key={section.title} className="mb-3">
            <h3 className="font-semibold text-lg text-orange-600 mb-1">{section.title}</h3>
            <ul className="space-y-1">
                {section.links.map((link, index) => (
                    <li key={index} className="text-sm">
                        {renderLink(link)}
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <Card className="w-full">
            <CardContent className="p-6 pt-4 pb-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        {menuSections['col1'].map(renderSection)}
                    </div>
                    <div className="space-y-6">
                        {menuSections['col2'].map(renderSection)}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export { MainMenu };
