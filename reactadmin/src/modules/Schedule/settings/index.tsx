//REACT
//COMPONENTS
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
//SETTINGS
import { Schedule } from "@/interfaces/types/ScheduleType";
//INTERFACE & TYPE
import {
    ActionParam,
    ButtonAction,
    OpenSheetFunction,
} from "@/interfaces/BaseServiceInterface";
//SERVICE
//HEPLERS
import { addCommas } from "@/helper/myHelper";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

const model = "schedules";
export const redirectIfSucces = "/schedule/index";

const breadcrumb = {
    index: {
        title: "Quản lý lịch khám bệnh",
        route: "/schedule/index",
    },
    create: {
        title: "Thêm mới lịch khám bệnh",
        description:
            "Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc",
        route: "/schedule/create",
    },
    update: {
        title: "Cập nhật thông tin",
        description:
            "Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc",
        route: "/schedule/update/:id",
    },
};

interface tableColumn {
    name: string;
    render: (item: Schedule) => JSX.Element;
}
const tableColumn: tableColumn[] = [
    {
        name: "Bác sĩ",
        render: (item: Schedule) => (
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
                        <span>{item.name}</span>
                    </div>
                </div>
            </div>
        ),
    },
    {
        name: "Thời gian khám",
        render: (item: Schedule) => (
            <span className="cursor-pointer cat-item-name mr-[10px] text-[#fff] inline-block rounded bg-cyan-600 px-[5px] py-[0px] ">{`${item.start_time} - ${item.end_time}`}</span>
        ),
    },
    {
        name: "Ngày khám bệnh",
        render: (item: Schedule) => (
            <span>{dayjs(item.date).format("DD/MM/YYYY")}</span>
        ),
    },
    {
        name: "Giá tiền",
        render: (item: Schedule) => (
            <span className="cursor-pointer cat-item-name mr-[10px] text-[#fff] inline-block rounded bg-cyan-600 px-[5px] py-[0px] text-[10px]">
                {addCommas(item.price)}đ
            </span>
        ),
    },
    {
        name: "Trạng thái",
        render: (item: Schedule) => (
            <span
                className={`cursor-pointer cat-item-name mr-[10px] text-[#fff] inline-block rounded px-[5px] py-[0px] text-[10px]  
            ${
                item.status === "OPEN"
                    ? "bg-[green]"
                    : item.status === "CLOSE"
                    ? "bg-[red]"
                    : "bg-[orange]"
            }`}
            >
                {item.status}
            </span>
        ),
    },
    {
        name: "Hoạt động",
        render: (item: Schedule) => {
            const now = dayjs(); // Thời gian hiện tại
            const appointmentDate = dayjs(
                `${item.date} ${item.start_time}`
            ); // Ngày khám

            const startTime = dayjs(
                `${item.date} ${item.start_time}`
            ); // Ngày giờ bắt đầu
            const endTime = dayjs(
                `${item.date} ${item.end_time}`
            ); // Ngày giờ kết thúc

            const isExpired = endTime.isBefore(now); // Đã qua thời gian khám
            const isOngoing = now.isBetween(startTime, endTime, "minute", "[)"); // Đang trong thời gian khám
            const daysLeft = appointmentDate.diff(now, "day"); // Số ngày còn lại đến ngày khám
            const hoursLeft = appointmentDate.diff(now, "hour"); // Số giờ còn lại
            const minutesLeft = appointmentDate.diff(now, "minute"); // Số phút còn lại

            // Hiển thị thời gian còn lại theo giờ hoặc ngày
            let timeLeftMessage = "";
            if (isExpired) {
                timeLeftMessage = "Hết hạn";
            } else if (isOngoing) {
                timeLeftMessage = "Đang diễn ra";
            } else {
                // Nếu còn ít hơn 24 giờ thì tính theo giờ, còn không thì tính theo ngày
                if (hoursLeft < 24) {
                    // Tính số giờ và phút còn lại
                    const remainingHours = Math.floor(minutesLeft / 60); // Số giờ còn lại
                    const remainingMinutes = minutesLeft % 60; // Số phút còn lại
                    timeLeftMessage =
                        remainingHours > 0
                            ? `Còn ${remainingHours} giờ ${remainingMinutes} phút`
                            : `Còn ${remainingMinutes} phút`;
                } else {
                    // Tính theo số ngày còn lại
                    timeLeftMessage = `Còn ${daysLeft} ngày`;
                }
            }

            return (
                <span
                    className={`cursor-pointer cat-item-name mr-[10px] text-[#fff] inline-block rounded px-[5px] py-[0px] text-[10px] 
                ${
                    isExpired
                        ? "bg-[#f00]"
                        : isOngoing
                        ? "bg-[orange]"
                        : "bg-teal-800"
                }`}
                    style={{
                        opacity: isExpired ? 0.5 : 1, // Làm mờ nếu hết hạn
                        pointerEvents: isExpired ? "none" : "auto", // Vô hiệu hóa tương tác nếu hết hạn
                    }}
                >
                    {timeLeftMessage}
                </span>
            );
        },
    },
];

const buttonActions: ButtonAction<ActionParam[]>[] = [
    {
        icon: <FaRegEdit className="text-white" />,
        className: "flex mr-[5px]",
        method: "update",
        params: ["id", "openSheet:f"],
        onClick: (id: string, openSheet: OpenSheetFunction) => {
            openSheet({ open: true, action: "update", id: id });
        },
    },
    {
        icon: <RiDeleteBin6Line className="text-white" />,
        className: "bg-[#ec4758] mr-[5px]",
        method: "delete",
        params: ["id", "handleAlertDialog:f", "destroy:f"],
        onClick: (id: string, handleAlertDialog: any, destroy: any) => {
            handleAlertDialog(id, destroy);
        },
    },
];

const options = [
    {
        value: "OPEN",
        label: "Đang rảnh",
    },
    {
        value: "CLOSE",
        label: "Đang bận",
    },
];

export { breadcrumb, buttonActions, model, tableColumn, options };
