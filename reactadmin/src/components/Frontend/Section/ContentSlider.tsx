import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface ContentSlider {
    settings: Object,
    className?: string,
    label?: string,
    dataCatalogue?: any,
    data: any
}

const ContentSlider = ({
    settings,
    className,
    dataCatalogue,
    label,
    data
}: ContentSlider) => {

    useEffect(() => {
        console.log(data);

    }, [data])

    return (
        <>
            <div className={`section-share ${className ?? ''}`}>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>{label ?? (dataCatalogue && dataCatalogue.name)}</span>
                        <button className='btn-section'>Xem thêm</button>
                    </div>
                    <div className='section-body'>
                        <Slider {...settings}>
                            {
                                data && data.map((value: any, index: string) => (
                                    className === 'section-outstanding-doctor' ? (
                                        <div className='section-customize' key={index}>
                                            <div className='customize-border'>
                                                <div className='outer-bg'>
                                                    <div
                                                        className='bg-image section-outstanding-doctor'
                                                        style={{ backgroundImage: `url(${value.image})` }}
                                                    />
                                                </div>
                                                <div className='position text-center'>
                                                    <Link key={index} to={`${value.specialties[0].value}/${value.specialties[0].canonical}/${value.id}/${value.canonical}.html`}>{value.name}</Link>
                                                    <div><span className="text-[#f00]">Chuyên khoa:</span> <Link key={index} to={`${value.specialties[0].value}/${value.specialties[0].canonical}.html`}>{value.specialties && value.specialties.length > 0 ? value.specialties[0].label : ""}</Link></div>
                                                </div>
                                            </div>
                                        </div>
                                    ) :
                                        (
                                            <div className='section-customize' key={index}>
                                                <div>
                                                    <div
                                                        className={`bg-image ${className ?? ''}`}
                                                        style={{ backgroundImage: `url(${value.icon})` }}
                                                    />
                                                    <Link key={index} to={`${value.id}/${value.canonical}.html`}>{value.name}</Link>
                                                </div>
                                            </div>
                                        )
                                ))
                            }
                        </Slider>
                    </div>
                </div >
            </div >
        </>
    )
}

export default ContentSlider