import logo from '../../assets/logo1.png'
import { FaHistory } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { RootState } from '@/redux/store'
import { useSelector } from "react-redux"
import { usePatientContext } from '@/contexts/PatientContext';
import { useEffect } from 'react';
import { LoadingSpinner } from '../ui/loading';
import { Button } from '../ui/button';
import { logout } from '@/service/Frontend/AuthPatientService';
import { setAuthPatientLogout } from "@/redux/slide/authPatientSlice";
import { useDispatch } from "react-redux";

const Header = () => {
    const { isAuthenticated, patient: patientRedux } = useSelector((state: RootState) => state.patient)
    const { patient: patientContext, setPatient } = usePatientContext()
    const dispatch = useDispatch();
    const handleLogout = async () => {
        try {
            const response = await logout();
            if (response?.status === 200) {
                setPatient(undefined);
                dispatch(setAuthPatientLogout());
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }

    }

    useEffect(() => {
        console.log(patientContext, patientRedux);
    }, [patientContext, patientRedux])

    return (
        <>
            <header className="bg-sky-50 ">
                <div className='w-[100%] h-[100%] flex justify-between'>
                    <div className=' w-[25%] flex items-center'>
                        <Link to={`/homepage`}>
                            <img src={logo} className=' w-[100%] h-[100%] bg-contain cursor-pointer transform scale-50' />
                        </Link>
                        <div className='w-[100%] h-[100%] bg-contain cursor-pointer transform scale-50'></div>
                    </div>
                    {/* <div className=' w-[50%] flex justify-between items-center'>
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
                    </div> */}
                    {
                        patientRedux && patientRedux !== null ? (
                            <div className='flex items-center w-[17%] mr-[10px]'>
                                <Link className='w-[50%] flex items-center cursor-pointer justify-end font-semibold' to={`/homepage/history/${patientRedux.id}`}>
                                    <FaHistory
                                        className='mr-[10px]'
                                    />
                                    Lịch hẹn
                                </Link>
                                <div className='flex w-[50%] justify-end items-center'>
                                    <Button onClick={() => handleLogout()} className='hover:text-[white] text-white px-[10px] py-[5px] bg-sky-300 rounded-lg font-semibold hover:bg-sky-400'>
                                        Đăng xuất
                                    </Button>
                                </div>
                            </div>
                        ) : patientRedux === null && patientContext !== null ? (
                            <div className='flex items-center justify-items-center w-[15%] mr-[10px]'>
                                <Link className='hover:text-[white] text-white text-center px-[10px] mr-[10px] w-[50%] py-[5px] bg-sky-300 rounded-lg font-semibold hover:bg-sky-400' to={`/patient/signin`}>
                                    Đăng nhập
                                </Link>
                                <Link className='hover:text-[white] text-white px-[10px] text-center w-[50%] py-[5px] bg-sky-300 rounded-lg font-semibold hover:bg-sky-400' to={`/patient/signup`}>
                                    Đăng ký
                                </Link>
                            </div>
                        ) : patientContext === undefined || patientContext === null && (
                            <div className="flex items-center w-[17%] mr-[10px] text-[10px]">
                                <LoadingSpinner className="mr-[5px]" />
                                Loading...
                            </div>
                        )
                    }
                    {/* </div> */}
                </div>


            </header >
        </>
    )
}
export default Header