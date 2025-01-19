//CORE REACT
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
//COMPONENT
import PageHeading from "@/components/heading";
import LoadingButton from "@/components/LoadingButton";
import CustomSystem from "@/components/System";
//SETTINGS
import { queryKey } from "@/constant/query";
import { breadcrumb, dataContact, dataGeneral, dataSeo, dataSocial } from "../setting";
//INTERFACES
import { TSystemPayloadInput } from "@/interfaces/types/SystemType";
//HOOK
import useFormSubmit from "@/hook/useFormSubmit";
import { FormProvider, useForm } from "react-hook-form";
//SERVICE
import { pagination, save } from "@/service/SystemService";
//SCSS
import '@/assets/scss/Editor.scss';





const System = ({

}) => {
    //--------------------------------------
    const breadcrumbData = useMemo(() => {
        const actionData = breadcrumb.index
        return { ...actionData };
    }, [breadcrumb]);

    //-------------------FormSubmit------------------
    const methods = useForm<TSystemPayloadInput>({
        mode: 'onSubmit'
    })
    const { handleSubmit, reset, formState: { errors } } = methods

    //Gui du lieu ve phia server
    const { onSubmitHanler, loading, isSuccess } = useFormSubmit(save, { action: '', id: '' })

    //useQuery
    const { data, isLoading, isError } = useQuery([queryKey.systems], () => pagination(''), {
        staleTime: 6000
    })






    // Tạo state để lưu dataGeneral đã cập nhật
    const [generalData, setGeneralData] = useState(dataGeneral);
    const [contactData, setContactData] = useState(dataContact);
    const [seoData, setSeoData] = useState(dataSeo);
    const [socialData, setSocialData] = useState(dataSocial);

    useEffect(() => {
        if (data && data.systems) {
            // Cập nhật dữ liệu cho từng mảng
            const updateData = (dataArray: any) =>
                dataArray.map((item: any) => {
                    const matchingSystem = data.systems.find((system: any) => system.keyword === item.keyword);
                    return {
                        ...item,
                        content: matchingSystem ? matchingSystem.content : item.content,
                    };
                });

            setGeneralData(updateData(dataGeneral));
            setContactData(updateData(dataContact));
            setSeoData(updateData(dataSeo));
            setSocialData(updateData(dataSocial));

        }
    }, [data]);

    useEffect(() => {
        console.log(generalData);
    }, [generalData, setGeneralData])




    return (
        <>
            <FormProvider {...methods}>
                <div className="page-container " >
                    <PageHeading breadcrumb={breadcrumbData} />
                    <div className="p-[15px]">
                        <form onSubmit={handleSubmit(onSubmitHanler)}>
                            <CustomSystem
                                data={generalData}
                                title="Thông tin chung"
                            />
                            <CustomSystem
                                data={contactData}
                                title="Thông tin liên hệ"
                            />
                            <CustomSystem
                                data={seoData}
                                title="Cấu hình SEO dành cho trang chủ"
                            />
                            <CustomSystem
                                data={socialData}
                                title="Cấu hình mạng xã hội dành cho trang chủ"
                            />
                            <div className="mt-[10px] text-right">
                                <LoadingButton
                                    loading={loading}
                                    text="Lưu thông tin"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </FormProvider>
        </>
    )
}

export default System