import { memo, useEffect } from "react";

interface ICustomDescriptionContent {
    dataDoctors: any;
    dataDescription: any;
}

const CustomDescriptionContent = ({
    dataDoctors,
    dataDescription,
}: ICustomDescriptionContent) => {
    return (
        <>
            <div className="px-[100px] bg-white pb-[10px]">
                <div className="page-heading py-[20px] border-b border-[#e7eaec] text-[25px] font-semibold">
                    {dataDescription ? dataDescription.name : "Loading..."}
                </div>
                <div
                    className="my-[10px] text-[18px]"
                    dangerouslySetInnerHTML={{
                        __html: dataDescription
                            ? dataDescription.description
                            : "Loading...",
                    }}
                ></div>
                <div
                    className=""
                    dangerouslySetInnerHTML={{
                        __html: dataDescription
                            ? dataDescription.content
                            : "Loading...",
                    }}
                ></div>
            </div>
        </>
    );
};

export default memo(CustomDescriptionContent);
