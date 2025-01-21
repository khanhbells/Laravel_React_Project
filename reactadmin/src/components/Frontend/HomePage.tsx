import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
//COMPONENT
import BannerHeader from "./Section/BannerHeader";
import ContentSlider from "./Section/ContentSlider";
import About from "./Section/About";
//SCSS
import '../../assets/scss/HomeHeader.scss'
import '../../assets/scss/HomePage.scss'
//SERVICE
import { findById, pagination } from "@/service/Frontend/FrontEndService";
//SETTINGS
import { endpoint } from "@/constant/endpoint";
import { queryKey } from "@/constant/query";

import useGetDataFrontEnd from "@/hook/useGetDataFrontEnd";
const HomePage = () => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
    };

    //GET SPECIALTIES
    const { getData: specialties, dataCatalogue: specialty_catalogues } = useGetDataFrontEnd({
        id: '13',
        endpointCatalogue: endpoint.specialty_catalogues,
        endpoint: endpoint.specialties,
        filter: '&specialty_catalogue_id=13&publish=2',
        queryKeyCatalogue: queryKey.specialty_catalogues,
        queryKey: queryKey.specialties
    })
    //GET BLOGS
    const { getData: posts, dataCatalogue: post_catalogues } = useGetDataFrontEnd({
        id: '7',
        endpointCatalogue: endpoint.post_catalogues,
        endpoint: endpoint.posts,
        filter: '&post_catalogue_id=7&publish=2',
        queryKeyCatalogue: queryKey.postCatalogues,
        queryKey: queryKey.posts
    })
    //GET DOCTORS
    const { getData: doctors } = useGetDataFrontEnd({
        endpoint: endpoint.doctors,
        filter: '&permission=true&publish=2',
        queryKey: queryKey.doctors
    })


    return (
        <>
            <BannerHeader />
            {
                specialty_catalogues?.publish === 2 &&
                <ContentSlider
                    settings={settings}
                    className="section-specialty"
                    dataCatalogue={specialty_catalogues}
                    data={specialties}
                />
            }
            <ContentSlider
                settings={settings}
                label="Bác sĩ nổi bật tuần qua"
                className="section-outstanding-doctor"
                data={doctors}
            />
            {
                post_catalogues?.publish === 2 &&
                <ContentSlider
                    settings={settings}
                    dataCatalogue={post_catalogues}
                    data={posts}
                />
            }
            <About />
        </>
    )
}

export default HomePage