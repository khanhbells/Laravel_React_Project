import { GiMedicinePills } from "react-icons/gi";
import { AiFillMedicineBox } from "react-icons/ai";
import { FaRegHospital } from "react-icons/fa6";
import { MdLocalPharmacy } from "react-icons/md";
import { PiAmbulanceBold } from "react-icons/pi";
import { MdOutlineSick } from "react-icons/md";
const BannerHeader = () => {
    return (
        <>
            <div className='home-header-banner'>
                <div className='content-up'>
                    <div className='title1 uppercase'>Nền tảng y tế</div>
                    <div className='title2 uppercase'>Chăm sóc sức khỏe toàn diện</div>
                    <div className='search'>
                        <i className="fas fa-search"></i>
                        <input type='text' placeholder='Tìm chuyên khoa khám bệnh'></input>
                    </div>
                </div>
                <div className='content-down'>
                    <div className='options'>
                        <div className='option-child'>
                            <div className='icon-child text-[30px]'> <GiMedicinePills /></div>
                            <div className='text-child'>Khám chuyên khoa</div>
                        </div>
                        <div className='option-child'>
                            <div className='icon-child text-[30px]'> <AiFillMedicineBox /></div>
                            <div className='text-child'>Khám từ xa</div>
                        </div>
                        <div className='option-child'>
                            <div className='icon-child text-[30px]'> <FaRegHospital /></div>
                            <div className='text-child'>Khám tổng quát</div>
                        </div>
                        <div className='option-child'>
                            <div className='icon-child text-[30px]'><MdLocalPharmacy /></div>
                            <div className='text-child'>Xét nghiệm y học</div>
                        </div>
                        <div className='option-child'>
                            <div className='icon-child text-[30px]'> <PiAmbulanceBold /></div>
                            <div className='text-child'>Sức khỏe tinh thần</div>
                        </div>
                        <div className='option-child'>
                            <div className='icon-child text-[30px]'> <MdOutlineSick /></div>
                            <div className='text-child'>Khám nha khoa</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BannerHeader