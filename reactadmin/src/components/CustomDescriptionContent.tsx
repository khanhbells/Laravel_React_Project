import { memo } from "react"

interface ICustomDescriptionContent {
    dataDoctors: any,
    dataSpecialties: any
}

const CustomDescriptionContent = ({
    dataDoctors,
    dataSpecialties
}: ICustomDescriptionContent) => {
    return (
        <>
            <div className="px-[100px] bg-white pb-[10px]">
                <div
                    className="page-heading py-[20px] border-b border-[#e7eaec] text-[25px] font-semibold"
                >
                    {dataDoctors && dataDoctors.doctors.length > 0 ? dataDoctors.doctors[0].specialties[0].label : (dataSpecialties) ? dataSpecialties.name : 'Loading...'}
                </div>
                <div className="my-[10px] text-[18px]"
                    dangerouslySetInnerHTML={{ __html: dataDoctors && dataDoctors.doctors.length > 0 ? dataDoctors.doctors[0].specialties[0].description : '' }}
                ></div>
                <div className=""
                    dangerouslySetInnerHTML={{ __html: dataDoctors && dataDoctors.doctors.length > 0 ? dataDoctors.doctors[0].specialties[0].content : '' }}
                ></div>
            </div>
        </>
    )
}

export default memo(CustomDescriptionContent)