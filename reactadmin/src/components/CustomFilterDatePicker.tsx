//REACT
import React from "react"
//COMPONENT
import { format } from "date-fns"
import { CalendarIcon, XCircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
//SETTINGS



export interface CustomFilterDatePickerProps {
    handleFilter: (value: string, field: string) => void,
    disabledDay: boolean
}

const CustomFilterDatePicker: React.FC<CustomFilterDatePickerProps> = ({
    handleFilter,
    disabledDay
}) => {

    const [date, setDate] = React.useState<Date>()

    const today = new Date()

    const onDateChange = (selectedDate: Date | undefined) => {
        setDate(selectedDate)
        if (selectedDate) {
            // Gửi giá trị ngày đã chọn đến handleFilter
            handleFilter(format(selectedDate, "yyyy-MM-dd"), "date")
        } else {
            // Nếu không chọn ngày, gửi giá trị rỗng
            handleFilter("", "date")
        }
    }

    const clearDate = () => {
        setDate(undefined) // Reset ngày
        handleFilter("", "date") // Gửi giá trị rỗng
    }

    return (
        <div className="flex items-center">
            <div className="mr-[10px]" >
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[240px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={onDateChange}
                            initialFocus
                            disabled={(day) => disabledDay ? day < today : false}
                        />
                    </PopoverContent>
                </Popover>

            </div>
            {date && (
                <button
                    type="button"
                    onClick={clearDate}
                    className="text-red-500 hover:text-red-700 "
                >
                    <XCircleIcon className="h-5 w-5 text-black" />
                </button>
            )}
        </div>
    )

}

export default CustomFilterDatePicker