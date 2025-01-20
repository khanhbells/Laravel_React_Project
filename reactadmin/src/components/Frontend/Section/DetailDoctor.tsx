import '../../../assets/scss/DetailDoctor.scss'
import imageSrc from '@/assets/172143-bsckiile-kim-sang.jpg'
import DoctorSchedule from './DoctorSchedule'
const DetailDoctor = () => {
    return (
        <div className="h-[full]">
            <div className='flex px-[200px] py-[10px] bg-[white] '>
                <div
                    className='w-[120px] h-[120px] rounded-full bg-cover bg-no-repeat bg-center'
                    style={{ backgroundImage: `url(${imageSrc})` }}
                >
                </div>
                <div className='w-[80%] flex flex-col pl-[10px]'>
                    {/* up */}
                    <div className='text-[20px] font-semibold pt-[15px]'>
                        Phó giáo sư Vũ Bảo Khánh
                    </div>
                    {/* down */}
                    <div className='pt-[10px]'>
                        <span className=''>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                        </span>
                    </div>
                </div>
            </div>
            <div className='schedule-doctor mx-[100px] h-[200px] flex my-[10px] pl-[65px]'>
                <div className='content-left w-[50%]'>
                    <DoctorSchedule />
                </div>
                <div className='content-right w-[50%]'>

                </div>
            </div>
            <div className='detail-info-doctor px-[200px] bg-[#f9f9f9] py-[10px] border-primary border-y'>
                <div>
                    Booking Bells là một nền tảng đặt lịch khám bệnh trực tuyến, giúp kết nối bệnh nhân với các phòng khám, bệnh viện, và bác sĩ. Website cung cấp các tính năng nổi bật như:

                    Đặt lịch khám dễ dàng: Cho phép bệnh nhân lựa chọn bác sĩ, chuyên khoa, và thời gian khám phù hợp.

                    Quản lý lịch hẹn: Người dùng có thể theo dõi, chỉnh sửa hoặc hủy lịch hẹn trực tuyến.

                    Tìm kiếm thông minh: Hỗ trợ tìm kiếm bác sĩ, chuyên khoa hoặc cơ sở y tế dựa trên vị trí và nhu cầu của bệnh nhân.

                    Thông báo nhắc lịch: Gửi thông báo qua email hoặc SMS để nhắc nhở người dùng về lịch khám sắp tới.

                    Hồ sơ sức khỏe: Lưu trữ và quản lý thông tin khám bệnh, giúp bệnh nhân dễ dàng theo dõi tình trạng sức khỏe.
                </div>
            </div>
            <div className='comment-doctor h-[50px]'>

            </div>
        </div>
    )
}

export default DetailDoctor