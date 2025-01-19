const breadcrumb = {
    index: {
        title: 'Cấu hình hệ thống',
        route: '/system/index'
    },
}

const model = 'systems'

const dataGeneral = [
    {
        label: "Tên công ty",
        keyword: "homepage_company",
        content: "",
        type: 'text'
    },
    {
        label: "Tên thương hiệu",
        keyword: "homepage_brand",
        content: "",
        type: 'text'
    },
    {
        label: "Slogan",
        keyword: "homepage_slogan",
        content: "",
        type: 'text'
    },
    {
        label: "Logo",
        keyword: "homepage_logon",
        content: "",
        type: 'image'
    },
    {
        label: "favicon",
        keyword: "homepage_favicon",
        content: "",
        type: 'image'
    },
    {
        label: "Bản quyền",
        keyword: "homepage_copyright",
        content: "",
        type: 'text'
    },
    {
        label: "Tình trạng webiste",
        keyword: "homepage_website",
        content: "",
        options: [
            { value: "open", label: 'Mở cửa website' },
            { value: "close", label: 'Đóng cửa website' },
        ],
        type: 'select'
    },
    {
        label: "Giới thiệu ngắn",
        keyword: "homepage_short_intro",
        content: "",
        type: 'textarea'
    },
]

const dataSeo = [
    {
        label: "Tiêu đề SEO",
        keyword: "seo_meta_title",
        content: "",
        type: 'text'
    },
    {
        label: "Từ khóa SEO",
        keyword: "seo_meta_keyword",
        content: "",
        type: 'text'
    },
    {
        label: "Mô tả",
        keyword: "seo_meta_description",
        content: "",
        type: 'text'
    },
    {
        label: "Ảnh SEO",
        keyword: "seo_meta_images",
        content: "",
        type: 'image'
    },
]

const dataSocial = [
    {
        label: "Facebook",
        keyword: "social_facebook",
        content: "",
        type: 'text'
    },
    {
        label: "Youtube",
        keyword: "social_youtube",
        content: "",
        type: 'text'
    },
    {
        label: "Twitter",
        keyword: "social_twitter",
        content: "",
        type: 'text'
    },
    {
        label: "Tiktok",
        keyword: "social_tiktok",
        content: "",
        type: 'text'
    },
    {
        label: "Instagram",
        keyword: "social_instagram",
        content: "",
        type: 'text'
    },
]

const dataContact = [
    {
        label: "Văn phòng giao dịch",
        keyword: "contact_office",
        content: "",
        type: 'text'
    },
    {
        label: "Địa chỉ",
        keyword: "contact_address",
        content: "",
        type: 'text'
    },
    {
        label: "Hotline",
        keyword: "contact_hotline",
        content: "",
        type: 'text'
    },
    {
        label: "Hotline kỹ thuật",
        keyword: "contact_technical_phone",
        content: "",
        type: 'text'
    },
    {
        label: "Hotline kinh doanh",
        keyword: "contact_sell_phone",
        content: "",
        type: 'text'
    },
    {
        label: "Số cố định",
        keyword: "contact_phone",
        content: "",
        type: 'text'
    },
    {
        label: "Fax",
        keyword: "contact_fax",
        content: "",
        type: 'text'
    },
    {
        label: "Email",
        keyword: "contact_email",
        content: "",
        type: 'text'
    },
    {
        label: "Mã số thuế",
        keyword: "contact_tax",
        content: "",
        type: 'text'
    },
    {
        label: "Website",
        keyword: "contact_website",
        content: "",
        type: 'text'
    },
    {
        label: "Bản đồ",
        keyword: "contact_map",
        content: "",
        type: 'text'
    },
]

export {
    breadcrumb,
    model,
    dataContact,
    dataGeneral,
    dataSeo,
    dataSocial
};

