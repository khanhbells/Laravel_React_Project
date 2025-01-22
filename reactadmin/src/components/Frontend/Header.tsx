import logo from '../../assets/logo1.png'
import { FaHistory } from "react-icons/fa";
import { Link } from 'react-router-dom';
const Header = () => {
    return (
        <>
            <header className="bg-sky-50">
                <div className='home-header-container'>
                    <div className='home-header-content'>

                        <div className='left-content'>
                            <i className="fas fa-bars"></i>
                            <Link to={`homepage`}>
                                <img src={logo} className='header-logo' />
                            </Link>
                            <div className='header-logo'></div>
                        </div>
                        <div className='center-content'>
                            <div className='child-content'>
                                <div><b>Chuyên khoa</b></div>
                                <div className='subs-title'>Tìm bác sĩ theo chuyên khoa</div>
                            </div>
                            <div className='child-content'>
                                <div><b>Cơ sở y tế</b></div>
                                <div className='subs-title'>Chọn bệnh viện phòng khám</div>
                            </div>
                            <div className='child-content'>
                                <div><b>Bác sĩ</b></div>
                                <div className='subs-title'>Chọn bác sĩ giỏi</div>
                            </div>
                            <div className='child-content'>
                                <div><b>Gói khám</b></div>
                                <div className='subs-title'>Khám sức khỏe tổng quát</div>
                            </div>
                        </div>
                        <div className='right-content'>
                            <div className='support'>
                                <FaHistory
                                    className='mr-[10px]'
                                />
                                Lịch hẹn
                            </div>
                        </div>
                    </div>
                </div>

            </header >
        </>
    )
}
export default Header