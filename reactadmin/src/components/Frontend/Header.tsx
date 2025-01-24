import logo from '../../assets/logo1.png'
import { FaHistory } from "react-icons/fa";
import { Link } from 'react-router-dom';
const Header = () => {
    return (
        <>
            <header className="bg-sky-50 ">
                <div className='w-[100%] h-[100%] flex'>
                    <div className=' w-[25%] flex items-center'>
                        <Link to={`homepage`}>
                            <img src={logo} className=' w-[100%] h-[100%] bg-contain cursor-pointer transform scale-50' />
                        </Link>
                        <div className='w-[100%] h-[100%] bg-contain cursor-pointer transform scale-50'></div>
                    </div>
                    <div className=' w-[50%] flex justify-between items-center'>
                        <div className='child-content'>
                            <div><b>Chuyên khoa</b></div>
                            <div className='subs-title text-[12px] font-normal'>Tìm bác sĩ theo chuyên khoa</div>
                        </div>
                        <div className='child-content'>
                            <div><b>Cơ sở y tế</b></div>
                            <div className='subs-title text-[12px] font-normal'>Chọn bệnh viện phòng khám</div>
                        </div>
                        <div className='child-content'>
                            <div><b>Bác sĩ</b></div>
                            <div className='subs-title text-[12px] font-normal'>Chọn bác sĩ giỏi</div>
                        </div>
                        <div className='child-content'>
                            <div><b>Gói khám</b></div>
                            <div className='subs-title text-[12px] font-normal'>Khám sức khỏe tổng quát</div>
                        </div>
                    </div>
                    <div className='flex items-center justify-end w-[25%]'>
                        <div className='pr-[50px] flex items-center cursor-pointer'>
                            <FaHistory
                                className='mr-[10px]'
                            />
                            Lịch hẹn
                        </div>
                    </div>
                    {/* </div> */}

                </div>


            </header >
        </>
    )
}
export default Header