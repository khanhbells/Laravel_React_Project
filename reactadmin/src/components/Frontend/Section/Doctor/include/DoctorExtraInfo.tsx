import { useEffect, useState } from "react"
import { useDataSchedule } from "@/contexts/DataScheduleContext"
import { addCommas } from "@/helper/myHelper"
import { Button } from "@/components/ui/button"
import { memo } from "react"
import { Sheet } from "@/hook/useSheet"
import { fetchPatient } from "@/service/Frontend/AuthPatientService"
import { useDispatch } from "react-redux"
import { setAuthPatientLogout } from "@/redux/slide/authPatientSlice"
interface IDoctorExtraInfo {
    dataDoctor: any,
    openSheet: (sheet: Sheet) => void,
    handleOpenSheet?: (doctor: any, schedules: { value: string, label: string }[]) => void,
    options?: { value: string, label: string }[]
}

const DoctoExtraInfo = ({
    dataDoctor,
    openSheet,
    handleOpenSheet,
    options,
}: IDoctorExtraInfo) => {

    const { selectedDataSchedule } = useDataSchedule()
    const dispatch = useDispatch();

    const [isShowDetailInfo, setIsoDetailInfo] = useState<boolean>(false)
    const handleShowDetailInfo = (status: boolean) => {
        setIsoDetailInfo(status)
    }

    // useEffect(() => {
    //     console.log(options);
    // }, [options])

    //openSheet
    const handleButtonAction = async () => {
        const response = await fetchPatient();
        if (response && response.publish === 1 || !response) {
            dispatch(setAuthPatientLogout())
        }
        if (handleOpenSheet) {
            handleOpenSheet(dataDoctor, options || [])
        }
        if (openSheet) {
            openSheet({ open: true, action: '', id: undefined })
        }
    }


    return (
        <>
            <div className="doctor-extra-info-container pl-[15px]">
                <div className="content-up mb-[10px]">
                    <div className="text-address uppercase">Địa chỉ phòng khám</div>
                    <div className="name-clinic font-semibold py-[5px] text-[#333]">{dataDoctor?.clinic_name}</div>
                    <div className="detail-address font-semibold text-[#333]">{dataDoctor?.clinic_address}</div>
                </div>
                {
                    selectedDataSchedule?.doctor_id === dataDoctor?.id &&
                    <div className="content-down">
                        {
                            isShowDetailInfo === false ? (
                                <div className="short-info">
                                    {
                                        selectedDataSchedule &&
                                        (
                                            <>
                                                GIÁ KHÁM: <span className="text-[#f00] font-semibold">{`${selectedDataSchedule ? `${addCommas(selectedDataSchedule.price)} đ.` : ''}`}</span>
                                                <span className="text-cyan-500 cursor-pointer" onClick={() => handleShowDetailInfo(true)}> Xem chi tiết</span>
                                            </>
                                        )
                                    }
                                </div>
                            ) : (
                                <>
                                    <div className="title-price mb-[10px]">GIÁ KHÁM: . </div>
                                    <div className="rounded border border-sky-200">
                                        <div className="detail-info p-[5px] bg-[#f8f8f8] rounded-t-lg">
                                            <div className="price pb-[5px]">
                                                <span className="left "> Giá khám:</span>
                                                <span className="right float-right text-[#f00] font-semibold"> {`${selectedDataSchedule ? `${addCommas(selectedDataSchedule.price)} đ.` : ''}`}</span>
                                            </div>
                                            <div className="note">
                                                Được ưu tiên khám trước khi đặt khám qua BookingBells.
                                            </div>
                                        </div>
                                        <div className="payment p-[5px] bg-[#eee] rounded-b-lg">
                                            Người bệnh có thể thanh toán chi phí bằng hình thức tiền mặt và quẹt thẻ
                                        </div>
                                    </div>
                                    <div className="text-cyan-500 not-italic mt-[5px] float-right" onClick={() => handleShowDetailInfo(false)}>
                                        <span className="cursor-pointer">Ẩn bảng giá</span>
                                    </div>
                                </>
                            )
                        }
                        {
                            selectedDataSchedule &&
                            <Button
                                type="button"
                                variant="outline"
                                className={`py-2 font-normal bg-sky-500 text-[white] mt-[5px]`}
                                onClick={() => handleButtonAction()}
                            >
                                Đặt lịch ngay
                            </Button>
                        }
                    </div>
                }
            </div>
        </>
    )
}

export default memo(DoctoExtraInfo)