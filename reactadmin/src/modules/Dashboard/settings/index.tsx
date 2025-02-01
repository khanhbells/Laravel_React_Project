//COMPONENTS
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { addCommas, getInitialName } from "@/helper/myHelper";
type TDashboard = {
    [key: string]: any
}

interface tableColumn {
    name: string,
    render: (item: TDashboard) => JSX.Element
}


const tableColumn: tableColumn[] = [
    {
        name: 'Bác sĩ',
        render: (item: TDashboard) => (
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <div className="flex items-center">
                    <Avatar className="mr-[15px] ml-[15px]">
                        {item.image ? <AvatarImage src={item.image} alt="avatar" /> : <AvatarFallback>{getInitialName(item.name)}</AvatarFallback>}
                    </Avatar>
                </div>
                <p className="hidden text-black dark:text-white sm:block">
                    {item.name}
                </p>
            </div>
        )
    },
    {
        name: 'Tổng đơn khám',
        render: (item: TDashboard) =>
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <p className="text-black dark:text-white font-semibold">{item.total_bookings}</p>
            </div>
    },
    {
        name: 'Tổng tiền kiếm được',
        render: (item: TDashboard) =>
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <p className="text-meta-7 font-semibold">{addCommas(item.total_prices)} VNĐ</p>
            </div>
    },
]

export {
    tableColumn
}