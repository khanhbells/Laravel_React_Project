//CORE REACT
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
//COMPONENT
import PageHeading from "@/components/heading";
import LoadingButton from "@/components/LoadingButton";
import CustomDatePicker from "@/components/CustomDatePicker";
import Parent from "@/components/Parent";
import Store from "@/components/StoreBookingMedicine";
import DetailBookingMedicine from "@/components/DetailBookingMedicine";
import CustomDialog from "@/components/CustomDialog";
//SETTINGS
import { queryKey } from "@/constant/query";
import { getDropdown } from "@/helper/myHelper";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { breadcrumb, model, redirectIfSuccess } from "../../settings";
//INTERFACES
import { BookingMedicinePayloadInput } from "@/interfaces/types/BookingMedicineType";
//HOOK
import useFormSubmit from "@/hook/useFormSubmit";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
//SERVICE
import { saveBookingMedicine } from "@/service/BookingService";
import { pagination } from "@/service/MedicineCatalogueService";
import { getUserById } from "@/service/UserService";
import { pagination as paginationBookingMedicine } from "@/service/MedicineService";
//SCSS
import '@/assets/scss/Editor.scss';
//CONTEXT
import { MedicineProvider } from "@/contexts/MedicineContext";
import { useUserContext } from "@/contexts/UserContext";
//Redux
import { setIdMedicineCatalogue } from "@/redux/slide/idMedicineCatalogueSlice";
import { endpoint } from "@/constant/endpoint";

const schema = yup.object().shape({
    medicine_catalogue_id: yup.string().optional(),
    medicines: yup.array().of(
        yup.object().shape({
            medicine_id: yup.string().required("Thuốc là bắt buộc"),
            dosage: yup.string().required("Liều lượng là bắt buộc"),
            qty: yup
                .string()
                .typeError("Số lượng phải là số") // Kiểm tra nếu nhập không phải số
                .min(1, "Số lượng phải lớn hơn hoặc bằng 1")
                .required("Số lượng là bắt buộc"),
            usage: yup.string().optional(),
        })
    ).required("Danh sách thuốc là bắt buộc"),
})

const StoreBookingMedicine = ({

}) => {
    //--------------STATE--------------------
    const [openDialog, setOpenDialog] = useState<boolean>()


    //--------------CONTEXT------------------
    const { user } = useUserContext();

    //--------------------------------------
    const navigate = useNavigate()
    const { id } = useParams()
    const currentAction = useMemo(() => id ? 'update' : '', [])
    const breadcrumbData = useMemo(() => {
        const actionData = breadcrumb.create;
        // Gán id vào route nếu currentAction là 'update'
        const route = actionData.route.replace(':id', id || '');
        return { ...actionData, route }; // Trả về dữ liệu breadcrumb với route đã được thay thế
    }, [currentAction, id, breadcrumb]);

    //-------------------FormSubmit------------------
    const methods = useForm<BookingMedicinePayloadInput>({
        resolver: yupResolver(schema),
        mode: 'onSubmit'
    })
    const { handleSubmit, reset, formState: { errors }, register } = methods

    //Gui du lieu ve phia server
    const { onSubmitHanler, loading, isSuccess } = useFormSubmit(saveBookingMedicine, { action: currentAction, id: id }, null, null, undefined, endpoint.bookingMedicine)



    // Tra ve view
    useEffect(() => {
        isSuccess === true && navigate(redirectIfSuccess)
    }, [isSuccess])

    //useQuery
    const { data: dropdown, isLoading: isDropdownLoading, isError: isDropDownError } = useQuery([queryKey.medicineCatalogues], () => pagination(''))
    //Dropdown Select Parent
    const medicine_catalogues = useMemo(() => {
        if (!isDropdownLoading && dropdown) {
            return dropdown['medicine_catalogues'] ? getDropdown(dropdown['medicine_catalogues']) : []
        }
        return []
    }, [dropdown, user])



    return (
        <>
            <MedicineProvider>
                <FormProvider {...methods}>
                    <div className="page-container " >
                        <PageHeading breadcrumb={breadcrumbData} />
                        <div className="p-[15px]">
                            <form onSubmit={handleSubmit(onSubmitHanler)}>
                                <div className="grid grid-cols-12 gap-4 ">
                                    <div className="col-span-10">
                                        <Store />
                                        <DetailBookingMedicine />
                                    </div>
                                    <div className="col-span-2">
                                        {dropdown &&
                                            < Parent
                                                name="medicine_catalogue_id"
                                                options={medicine_catalogues}
                                                label="Loại thuốc"
                                                setId={setIdMedicineCatalogue}
                                            />
                                        }
                                        <div className="mt-[20px] text-right">
                                            <LoadingButton
                                                loading={loading}
                                                text="Lưu thông tin"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </FormProvider>
            </MedicineProvider>
        </>
    )
}

export default StoreBookingMedicine