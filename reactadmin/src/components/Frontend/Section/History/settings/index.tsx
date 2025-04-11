//REACT
//COMPONENTS
import { IoEyeOutline } from "react-icons/io5";

//SETTINGS
import { Booking } from "@/interfaces/types/BookingType";
//INTERFACE & TYPE
import {
    ActionParam,
    ButtonAction,
    OpenSheetFunction,
    Select,
} from "@/interfaces/BaseServiceInterface";
//HOOK
import dayjs from "dayjs";
import { BsSignStop } from "react-icons/bs";

const breadcrumb = {
    index: {
        title: "Lịch sử đặt lịch hẹn khám bệnh",
        route: "",
    },
    medicines: {
        title: "Đơn dặt lịch khám",
        description:
            "Đây là thông tin chi tiết đơn đặt lịch khám của bạn, Vui lòng đọc kỹ thông tin và đến hẹn đúng giờ, để mọi lịch khám diễn ra thuận lợi. Xin cảm ơn!",
        route: "",
    },
};

const model = "historys";

interface tableColumn {
    name: string;
    render: (item: Booking) => JSX.Element;
}

const tableColumn: tableColumn[] = [
    {
        name: "Bác sĩ",
        render: (item: Booking) => (
            <div className="flex items-center">
                <div className="block mr-[10px]">
                    <img
                        className=" object-cover h-[60px] w-[100px] rounded cursor-pointer"
                        src={item.image}
                        alt=""
                    />
                </div>
                <div>
                    <div className="name">
                        <span>{item.name_doctor}</span>
                    </div>
                </div>
            </div>
        ),
    },
    {
        name: "Ngày khám",
        render: (item: Booking) => (
            <span>{dayjs(item.date).format("DD/MM/YYYY")}</span>
        ),
    },
    {
        name: "Thời gian khám",
        render: (item: Booking) => (
            <span className="cursor-pointer cat-item-name mr-[10px] text-[#fff] inline-block rounded bg-cyan-600 px-[5px] py-[0px] ">{`${item.start_time} - ${item.end_time}`}</span>
        ),
    },
    {
        name: "Thời gian đặt lịch",
        render: (item: Booking) => (
            <span>
                {dayjs(item.booking_date).format("DD/MM/YYYY - HH:mm:ss")}
            </span>
        ),
    },
    {
        name: "Trạng thái xác nhận",
        render: (item: Booking) => (
            <span
                className={`cursor-pointer cat-item-name mr-[10px] text-[#fff] inline-block rounded px-[5px] py-[0px] text-[12px] ${
                    item.status === "pending"
                        ? "bg-[orange]"
                        : item.status === "confirm"
                        ? "bg-[green]"
                        : item.status === "stop"
                        ? "bg-[red]"
                        : ""
                }`}
            >
                {item.status === "pending"
                    ? "Đang chờ xác nhận"
                    : item.status === "confirm"
                    ? "Đã xác nhận"
                    : item.status === "stop"
                    ? "Đã hủy"
                    : ""}
            </span>
        ),
    },
    {
        name: "Hình thức thanh toán",
        render: (item: Booking) => (
            <span className="">
                {item.method === "cod"
                    ? "Thanh toán trực tiếp"
                    : item.method === "momo"
                    ? "Thanh toán bằng ví Momo"
                    : item.method === "paypal"
                    ? "Thanh toán bằng Paypal"
                    : item.method === "vnpay"
                    ? "Thanh toán bằng VNPAY"
                    : item.method === "zalopay"
                    ? "Thanh toán bằng ZaloPay"
                    : ""}
            </span>
        ),
    },
    {
        name: "Trạng thái thanh toán",
        render: (item: Booking) => (
            <span
                className={`cursor-pointer cat-item-name mr-[10px] text-[#fff] inline-block rounded px-[5px] py-[0px] text-[12px] ${
                    item.payment_status === "pending"
                        ? "bg-[orange]"
                        : item.payment_status === "confirm"
                        ? "bg-[green]"
                        : item.payment_status === "stop"
                        ? "bg-[red]"
                        : ""
                }`}
            >
                {item.payment_status === "pending"
                    ? "Chưa thanh toán"
                    : item.payment_status === "confirm"
                    ? "Đã thanh toán"
                    : item.payment_status === "stop"
                    ? "Đã hủy"
                    : ""}
            </span>
        ),
    },
];

const buttonActions: ButtonAction<ActionParam[]>[] = [
    {
        icon: <IoEyeOutline className="text-white" />,
        className: "flex mr-[5px]",
        method: "create",
        params: ["id", "openSheet:f"],
        onClick: (id: string, openSheet: OpenSheetFunction) => {
            openSheet({ open: true, action: "update", id: id });
        },
    },
    {
        icon: <BsSignStop className="text-white" />,
        className: "bg-[#ec4758] mr-[5px]",
        method: "delete",
        params: ["id", "handleAlertDialog:f", "stopBooking:f"],
        onClick: (id: string, handleAlertDialog: any, stopBooking: any) => {
            handleAlertDialog(id, stopBooking);
        },
    },
];

export { breadcrumb, model, tableColumn, buttonActions };
