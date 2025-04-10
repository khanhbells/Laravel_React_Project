import { toast } from "react-toastify"
import { ToastType } from "../contexts/ToastContext"
import { format } from "date-fns";
import { vi } from "date-fns/locale";
export const showNotify = (
    message: string,
    type: ToastType,
    setMessage: (message: string, type?: ToastType) => void
) => {
    if (message) {
        switch (type) {
            case 'success':
                toast.success(message)
                break;
            case 'warning':
                toast.warning(message)
                break;
            case 'error':
                toast.error(message)
                break;
            default:
                break;
        }
        setMessage('', null)
    }
}

export const showToast = (
    message: string,
    type: ToastType,
) => {
    if (message) {
        switch (type) {
            case 'success':
                toast.success(message)
                break;
            case 'warning':
                toast.warning(message)
                break;
            case 'error':
                toast.error(message)
                break;
            default:
                break;
        }
    }


}

export function getInitialName(string: string) {
    //split tach chuoi thanh mang
    const words = string.trim().split(/\s+/)

    const initial = words.map(word => word.charAt(0).toUpperCase()).join('')
    return initial
}

export const slug = (str: string): string => {
    str = str.toLowerCase(); // chuyen ve ki tu biet thuong
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|,|\.|\:|\;|\'|\–| |\"|\&|\#|\[|\]|\\|\/|~|$|_/g, "-");
    str = str.replace(/-+-/g, "-");
    str = str.replace(/^\-+|\-+$/g, "");
    return str;
};

export const addCommas = (nStr: string | number | undefined): string | undefined => {

    nStr = String(nStr);
    nStr = nStr.replace(/[^0-9]/g, "");
    nStr = nStr.replace(/\./gi, "");
    let str = '';
    for (let i = nStr.length; i > 0; i -= 3) {
        let a = ((i - 3) < 0) ? 0 : (i - 3);
        str = nStr.slice(a, i) + '.' + str;
    }
    str = str.slice(0, str.length - 1);
    return str;
}


export const getDropdown = (data: { [key: string]: any }, params?: any): { value: string, label: string }[] => {
    const temp: { value: string, label: string }[] = []
    temp.push({
        value: '0',
        label: (params && params.text) ? params.text : '[Root]'
    })

    if (Array.isArray(data)) {
        data.forEach((item) => {
            temp.push({
                value: item.id.toString(),
                label: formatCatalogueName(item)
            })
        })
    }
    return temp
}

export const getDropdownDate = (data: { [key: string]: any }, params?: any): { value: string, label: string }[] => {
    const temp: { value: string, label: string }[] = [];
    //Set để lọc giá trị trùng lặp
    const uniqueDates = new Set<string>();
    if (Array.isArray(data)) {
        data.forEach((item) => {
            if (!uniqueDates.has(item.date)) {
                uniqueDates.add(item.date);
                const formattedDate = format(new Date(item.date), "EEEE - dd/MM", { locale: vi });
                temp.push({
                    value: item.date,
                    label: formattedDate,
                });
            }
        });
    }

    return temp;
};

// Sử dụng hàm repeat để lặp lại chuỗi "|----" dựa trên giá trị của catalogue.level
export const formatCatalogueName = (catalogue: { [key: string]: any }, labelKey: string = 'name') => {
    const prefix = '|----'.repeat((catalogue.level > 0) ? catalogue.level - 1 : 0)

    return `${prefix}${catalogue[labelKey]}`
}

export const removeHtmlTags = (input: any) => {
    return input.replace(/<[^>]*>/g, '')
}

export const writeUrl = (
    canonical: string = '',
    model: string = '',
    id: string = '',
    subCanonical: string[] = [],
    subId: string[] = [],
    html: boolean = true
) => {
    let url = `/homepage/${model}/${id}/${canonical}`;

    // Nếu có subCanonical, subModel, subId thì nối thêm vào URL
    if (subId.length > 0) {
        const subPaths = subId.map((sub, index) => {
            const subCan = subCanonical[index] || '';
            return `${sub}/${subCan}`;
        });

        url += '/' + subPaths.join('/');
    }

    // Nếu html = true, thêm ".html" vào cuối URL
    return html ? `${url}.html` : url;
};