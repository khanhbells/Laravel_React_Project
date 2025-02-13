import CustomHelmet from "@/components/CustomHelmet";
import Store from "./include/Store";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
const SignUp = () => {



    return (
        <>
            <CustomHelmet
                meta_title={'Đăng ký thành viên'}
                meta_keyword={'signup'}
                meta_description={'Đây là trang đăng ký'}
                canonical={`patient/signup`}
            />
            <div className="bg-sky-100 px-[500px] py-[15px]">
                <div className="text-center uppercase font-semibold text-[20px] mb-[10px]">Đăng ký thành viên</div>
                <Card className="">
                    <CardContent>
                        <Store
                            id={undefined}
                            action="create"
                            patientCatalogueData={[]}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default SignUp