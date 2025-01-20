import React from "react";
//COMPONENT
import BannerHeader from "./Section/BannerHeader";
import ContentSlider from "./Section/ContentSlider";
import About from "./Section/About";
//SCSS
import '../../assets/scss/HomeHeader.scss'
import '../../assets/scss/HomePage.scss'
const HomePage = () => {

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
    };
    return (
        <>
            <BannerHeader />
            <ContentSlider
                settings={settings}
                label="Chuyên khoa phổ biến"
                className="section-specialty"
            />
            <ContentSlider
                settings={settings}
                label="Cơ sở y tế nổi bật"
                className="section-medical-facility"
            />
            <ContentSlider
                settings={settings}
                label="Bác sĩ nổi bật tuần uqa"
                className="section-outstanding-doctor"
            />
            <About />
        </>
    )
}

export default HomePage