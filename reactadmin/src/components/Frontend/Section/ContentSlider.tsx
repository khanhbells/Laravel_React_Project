import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LoadingSpinner } from '@/components/ui/loading';
import { memo } from "react";
import { writeUrl } from "@/helper/myHelper";
interface IContentSlider {
    settings: Object,
    className?: string,
    label?: string,
    dataCatalogue?: any,
    data: any,
    isLoading: boolean,
    nameCatalogueParams: string
}

const ContentSlider = ({
    settings,
    className,
    dataCatalogue,
    label,
    data,
    isLoading,
    nameCatalogueParams
}: IContentSlider) => {

    useEffect(() => {
        console.log(data);

    }, [data])

    return (
        <>
            <div className={`section-share border-b-2 border-sky-200 rounder-lg ${className ?? ''}`}>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>{label ?? (dataCatalogue && dataCatalogue.name)}</span>
                        <Link to={`/homepage/${nameCatalogueParams}/${dataCatalogue?.id}/${dataCatalogue?.canonical}.html`} className="btn-section rounded-lg bg-sky-500 text-[white] text-[13px]">Xem thêm</Link>
                    </div>
                    <div className='section-body'>
                        {
                            !isLoading ? (
                                <Slider {...settings}>
                                    {
                                        data && data.map((value: any, index: string) => (
                                            className === 'section-outstanding-doctor' ? (
                                                <div className='section-customize ' key={index}>
                                                    <div className='customize-border border border-teal-200 rounded-xl bg-[white]'>
                                                        <div className='outer-bg '>
                                                            <div
                                                                className='bg-image section-outstanding-doctor bg-cover'
                                                                style={{ backgroundImage: `url(${value.image})` }}
                                                            />
                                                        </div>
                                                        <div className='position text-center'>
                                                            <Link
                                                                key={index}
                                                                to={`/homepage/${nameCatalogueParams}/${dataCatalogue?.id}/${dataCatalogue?.canonical}/${value.specialties[0].value}/${value.specialties[0].canonical}/${value.id}/${value.canonical}.html`}
                                                            >
                                                                <span className="font-semibold">{value.name}</span>
                                                            </Link>
                                                            <div className="">
                                                                <span className="text-[#f00] mr-[2px] font-normal">
                                                                    Chuyên khoa:
                                                                </span>
                                                                <Link
                                                                    key={index}
                                                                    to={`/homepage/specialty/${dataCatalogue?.id}/${dataCatalogue?.canonical}/${value.specialties[0].value}/${value.specialties[0].canonical}.html`}
                                                                >
                                                                    <span className="font-semibold">
                                                                        {value.specialties && value.specialties.length > 0 ? value.specialties[0].label : ""}
                                                                    </span>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) :
                                                (
                                                    <div className='section-customize mr-[10px]' key={index}>
                                                        <div className="font-semibold">
                                                            <div
                                                                className={`rounded-xl border border-teal-200 bg-image ${className ?? ''}`}
                                                                style={{ backgroundImage: `url(${value.icon})` }}
                                                            />
                                                            <div className="w-[80%] mt-[5px]">
                                                                <Link
                                                                    key={index}
                                                                    to={writeUrl(dataCatalogue?.canonical, nameCatalogueParams, dataCatalogue?.id, [value.canonical], [value.id], true)}
                                                                    className="mt-[10px] text-[13px] "
                                                                >
                                                                    <span>
                                                                        {value.name}
                                                                    </span>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                        ))
                                    }
                                </Slider>
                            ) : (
                                <div className="flex items-center justify-center w-full">
                                    <LoadingSpinner />
                                    <span className="ml-[5px]">Loading...</span>
                                </div>
                            )
                        }
                    </div>
                </div >
            </div >
        </>
    )
}

export default memo(ContentSlider)