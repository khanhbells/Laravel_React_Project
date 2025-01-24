import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
//COMPONENT
import BannerHeader from "./Section/BannerHeader";
import ContentSlider from "./Section/ContentSlider";
import About from "./Section/About";
//SCSS

//COMPONENT

//SETTINGS
import { endpoint } from "@/constant/endpoint";
import { queryKey } from "@/constant/query";

import useGetDataFrontEnd from "@/hook/useGetDataFrontEnd";
const HomePage = () => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
    };

    //GET SPECIALTIES
    const { getData: specialties, dataCatalogue: specialty_catalogues, isLoading: isLoadingSpecialties } = useGetDataFrontEnd({
        id: '13',
        endpointCatalogue: endpoint.specialty_catalogues,
        endpoint: endpoint.specialties,
        filter: '&specialty_catalogue_id=13&publish=2',
        queryKeyCatalogue: queryKey.specialty_catalogues,
        queryKey: queryKey.specialties
    })
    //GET BLOGS
    const { getData: posts, dataCatalogue: post_catalogues, isLoading: isPostsLoading } = useGetDataFrontEnd({
        id: '7',
        endpointCatalogue: endpoint.post_catalogues,
        endpoint: endpoint.posts,
        filter: '&post_catalogue_id=7&publish=2',
        queryKeyCatalogue: queryKey.postCatalogues,
        queryKey: queryKey.posts
    })
    //GET DOCTORS
    const { getData: doctors, isLoading: isDoctorsLoading } = useGetDataFrontEnd({
        endpoint: endpoint.doctors,
        filter: '&permission=true&publish=2',
        queryKey: queryKey.doctors
    })


    return (
        <>
            <BannerHeader />
            <div className="bg-sky-100">
                {
                    specialty_catalogues?.publish === 2 &&
                    <ContentSlider
                        settings={settings}
                        className="section-specialty"
                        dataCatalogue={specialty_catalogues}
                        data={specialties}
                        isLoading={isLoadingSpecialties}
                        nameCatalogueParams="specialty"
                    />
                }
                <ContentSlider
                    settings={settings}
                    label="Bác sĩ nổi bật"
                    className="section-outstanding-doctor"
                    data={doctors}
                    dataCatalogue={specialty_catalogues}
                    isLoading={isPostsLoading}
                    nameCatalogueParams="specialty"
                />
                {
                    post_catalogues?.publish === 2 &&
                    <ContentSlider
                        settings={settings}
                        dataCatalogue={post_catalogues}
                        data={posts}
                        isLoading={isDoctorsLoading}
                        nameCatalogueParams="post"
                    />
                }
                <About />
            </div>
        </>
    )
}

export default HomePage