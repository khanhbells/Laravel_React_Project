import { LoadingSpinner } from "@/components/ui/loading"
import { Link } from "react-router-dom"
import { memo } from "react"

interface IDoctorInfor {
    dataDoctor: any,
    className?: string,
    params?: string,
}
const DoctorInfor = ({
    dataDoctor,
    className,
    params
}: IDoctorInfor) => {
    return (
        <>
            <div className={`flex ${className ?? ''} bg-[white]`}>
                {dataDoctor ? (
                    <div
                        className="w-[120px] h-[120px] rounded-full bg-cover bg-no-repeat bg-center"
                        style={{ backgroundImage: `url(${dataDoctor.image})` }}
                    ></div>
                ) : (
                    <LoadingSpinner />
                )}
                <div className='w-[80%] flex flex-col ml-[20px]'>
                    {/* up */}
                    {
                        params ? (
                            <Link className="text-[20px] font-semibold" to={params}>
                                {
                                    `${dataDoctor ? dataDoctor.exp : ''} ${dataDoctor ? dataDoctor.name : 'Loading...'}`
                                }
                            </Link>
                        ) : (
                            <div className='text-[20px] font-semibold  '>
                                {
                                    `${dataDoctor ? dataDoctor.exp : ''} ${dataDoctor ? dataDoctor.name : 'Loading...'}`
                                }
                            </div>
                        )
                    }
                    {/* down */}
                    <div className='pt-[10px]'>
                        <span
                            className=''
                            dangerouslySetInnerHTML={{ __html: dataDoctor?.description }}
                        ></span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default memo(DoctorInfor)