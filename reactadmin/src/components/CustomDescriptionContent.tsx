import { memo, useEffect } from "react"

interface ICustomDescriptionContent {
    dataDoctors: any,
    dataSpecialties: any
}

const CustomDescriptionContent = ({
    dataDoctors,
    dataSpecialties
}: ICustomDescriptionContent) => {
    useEffect(() => {
        console.log(dataSpecialties);

    }, [dataSpecialties])
    return (
        <>
            <div className="px-[100px] bg-white pb-[10px]">
                <div
                    className="page-heading py-[20px] border-b border-[#e7eaec] text-[25px] font-semibold"
                >
                    {(dataSpecialties) ? dataSpecialties.name : 'Loading...'}
                </div>
                <div className="my-[10px] text-[18px]"
                    dangerouslySetInnerHTML={{ __html: (dataSpecialties) ? dataSpecialties.description : 'Loading...' }}
                ></div>
                <div className=""
                    dangerouslySetInnerHTML={{ __html: (dataSpecialties) ? dataSpecialties.content : 'Loading...' }}
                ></div>
            </div>
        </>
    )
}

export default memo(CustomDescriptionContent)