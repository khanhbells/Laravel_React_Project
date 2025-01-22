import { Link } from "react-router-dom";
import { LoadingSpinner } from "./ui/loading";
import { memo, useEffect } from "react";

interface IDetailContent {
    data: any,
    catalogueId: string | undefined,
    catalogue: string | undefined,
    isLoading: boolean,
    nameCatalogueParams: string,
    [key: string]: any
}

const DetailContent = ({
    data,
    catalogueId,
    catalogue,
    isLoading,
    nameCatalogueParams
}: IDetailContent) => {
    return (
        <>
            <div className="flex h-[100%] px-[120px] py-[10px] min-h-[300px] flex-wrap">
                {
                    data && data.length > 0 ? data.map((value: IDetailContent, index: number) => (
                        <div className='section-customize mr-[10px] mb-[20px]' key={value.id}>
                            <div className="font-semibold">
                                <div
                                    className={`rounded-xl border border-teal-200 h-[150px] w-[260px] bg-cover bg-center mr-[20px]`}
                                    style={{ backgroundImage: `url(${value.image})` }}
                                />
                                <div className="w-[80%] mt-[5px]">
                                    <Link
                                        key={index}
                                        to={`/homepage/${nameCatalogueParams}/${catalogueId && catalogueId}/${catalogue && catalogue}/${value.id}/${value.canonical}.html`}
                                        className="mt-[10px] text-[13px] "
                                    >
                                        <span>
                                            {value.name}
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )) : isLoading ? (
                        <div className="flex items-center justify-center w-full">
                            <LoadingSpinner className="mr-[5px]" />
                            Loading...
                        </div>
                    ) : (
                        <div className="italic text-[#f00]">
                            Không có dữ liệu để hiển thị
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default memo(DetailContent)