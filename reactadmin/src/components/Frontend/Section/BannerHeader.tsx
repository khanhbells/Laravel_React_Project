import { GiMedicinePills } from "react-icons/gi";
import { AiFillMedicineBox } from "react-icons/ai";
import { FaRegHospital } from "react-icons/fa6";
import { MdLocalPharmacy } from "react-icons/md";
import { PiAmbulanceBold } from "react-icons/pi";
import { MdOutlineSick } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { useEffect, useState } from "react";
import calendarImage from "@/assets/calendar.jpg";
import doctorImage from "@/assets/examination.jpg";
import videoImage from "@/assets/video.jpg";
import syringeImage from "@/assets/syringe.jpg";
const BannerHeader = () => {
    const placeholderText = "Tìm chuyên khoa khám bệnh";
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const typingSpeed = isDeleting ? 50 : 100; // Tốc độ gõ và xóa
        const timeout = setTimeout(() => {
            if (!isDeleting) {
                // Gõ chữ
                if (index < placeholderText.length) {
                    setDisplayText((prev) => prev + placeholderText[index]);
                    setIndex(index + 1);
                } else {
                    setIsDeleting(true);
                }
            } else {
                // Xóa chữ
                if (index > 0) {
                    setDisplayText((prev) => prev.slice(0, -1));
                    setIndex(index - 1);
                } else {
                    setIsDeleting(false);
                }
            }
        }, typingSpeed);

        return () => clearTimeout(timeout);
    }, [index, isDeleting]);

    return (
        <>
            <div className='home-header-banner'>
                <div className='content-up'>
                    <div className='text-shadow-sm font-montserrat  text-[40px] text-center font-semibold my-[10px]'>Nền tảng y tế</div>
                    <div className='text-shadow-sm font-montserrat  text-[40px] text-center font-semibold my-[20px]'>Chăm sóc sức khỏe toàn diện</div>
                    <div className='w-fit bg-white rounded-lg flex justify-center items-center mx-auto p-[10px]'>
                        <CiSearch className=" mr-[10px] text-[20px]" />
                        <input
                            type='text'
                            className="w-[360px] col-span-3 focus-visible:ring-0 focus:outline-none focus:border-sky-500 focus:ring-2"
                            placeholder={displayText}
                        ></input>
                    </div>
                </div>
                <div className='content-down'>
                    <div className='options pb-[5%]'>
                        <div className='drop-shadow-xl option-child bg-white border border-sky-200 hover:border-sky-400 w-[220px] max-h-[300px] rounded-lg p-[10px]'>
                            <div className='icon-child items-center justify-center flex flex-col '>
                                <span className="">
                                    <img className="" src={calendarImage} alt="" />
                                </span>
                            </div>
                            <div className='text-child text-[17px] text-[#003553] font-roboto font-normal'>Khám theo chuyên khoa</div>
                        </div>
                        <div className='drop-shadow-xl option-child bg-white border border-sky-200 hover:border-sky-400 w-[220px] max-h-[300px] rounded-lg p-[10px]'>
                            <div className='icon-child items-center justify-center flex flex-col '>
                                <span className="">
                                    <img className="" src={doctorImage} alt="" />
                                </span>
                            </div>
                            <div className='text-child text-[17px] text-[#003553] font-roboto font-normal'>Khám theo bác sĩ</div>
                        </div>
                        <div className='drop-shadow-xl option-child bg-white border border-sky-200 hover:border-sky-400 w-[220px] max-h-[300px] rounded-lg p-[10px]'>
                            <div className='icon-child items-center justify-center flex flex-col '>
                                <span className="">
                                    <img className="" src={videoImage} alt="" />
                                </span>
                            </div>
                            <div className='text-child text-[17px] text-[#003553] font-roboto font-normal'>Gọi video với bác sĩ</div>
                        </div>
                        <div className='drop-shadow-xl option-child bg-white border border-sky-200 hover:border-sky-400 w-[220px] max-h-[300px] rounded-lg p-[10px]'>
                            <div className='icon-child items-center justify-center flex flex-col '>
                                <span className="">
                                    <img className="" src={syringeImage} alt="" />
                                </span>
                            </div>
                            <div className='text-child text-[17px] text-[#003553] font-roboto font-normal'>Đặt lịch xét nghiệm</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BannerHeader