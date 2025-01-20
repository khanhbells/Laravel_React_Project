import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ContentSlider {
    settings: Object,
    label?: string,
    className?: string
}

const ContentSlider = ({
    settings,
    label,
    className
}: ContentSlider) => {
    return (
        <>
            <div className={`section-share ${className ?? ''}`}>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>{label}</span>
                        <button className='btn-section'>Xem thêm</button>
                    </div>
                    <div className='section-body'>
                        <Slider {...settings}>
                            <div className='section-customize'>
                                {
                                    className === "section-outstanding-doctor" ? (
                                        <div className='customize-border'>
                                            <div className='outer-bg'>
                                                <div className='bg-image section-outstanding-doctor' />
                                            </div>
                                            <div className='position text-center'>
                                                <div>Kỹ sư Vũ Bảo Khánh</div>
                                                <div>Cơ Xương Khớp 1</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className={`bg-image ${className ?? ''}`} />
                                            <div>Cơ xương khớp 2</div>
                                        </div>
                                    )
                                }
                            </div>
                            <div className='section-customize'>
                                {
                                    className === "section-outstanding-doctor" ? (
                                        <div className='customize-border'>
                                            <div className='outer-bg'>
                                                <div className='bg-image section-outstanding-doctor' />
                                            </div>
                                            <div className='position text-center'>
                                                <div>Kỹ sư Vũ Bảo Khánh</div>
                                                <div>Cơ Xương Khớp 1</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className={`bg-image ${className ?? ''}`} />
                                            <div>Cơ xương khớp 3</div>
                                        </div>
                                    )
                                }
                            </div>
                            <div className='section-customize'>
                                {
                                    className === "section-outstanding-doctor" ? (
                                        <div className='customize-border'>
                                            <div className='outer-bg'>
                                                <div className='bg-image section-outstanding-doctor' />
                                            </div>
                                            <div className='position text-center'>
                                                <div>Kỹ sư Vũ Bảo Khánh</div>
                                                <div>Cơ Xương Khớp 1</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className={`bg-image ${className ?? ''}`} />
                                            <div>Cơ xương khớp 3</div>
                                        </div>
                                    )
                                }
                            </div>
                            <div className='section-customize'>
                                {
                                    className === "section-outstanding-doctor" ? (
                                        <div className='customize-border'>
                                            <div className='outer-bg'>
                                                <div className='bg-image section-outstanding-doctor' />
                                            </div>
                                            <div className='position text-center'>
                                                <div>Kỹ sư Vũ Bảo Khánh</div>
                                                <div>Cơ Xương Khớp 1</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className={`bg-image ${className ?? ''}`} />
                                            <div>Cơ xương khớp 3</div>
                                        </div>
                                    )
                                }
                            </div>
                        </Slider>
                    </div>
                </div >
            </div >
        </>
    )
}

export default ContentSlider