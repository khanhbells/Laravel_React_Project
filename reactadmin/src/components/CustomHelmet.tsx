import { Helmet } from "react-helmet-async"
import logo from "@/assets/logobooking.png";
interface ICustomHelmet {
    meta_title: string
    meta_description: string,
    meta_keyword: string,
    canonical: string,
}

const CustomHelmet = ({
    meta_title,
    meta_description,
    meta_keyword,
    canonical
}: ICustomHelmet) => {
    return (
        <>
            <Helmet>
                <title>{meta_title}</title>
                <meta http-equiv="content-type" content="text/html; charset=utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content={meta_description} />
                <meta name="keywords" content={meta_keyword} />
                <meta name="author" content="BookingBells" />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={`${import.meta.env.VITE_BASE_URL}/${canonical}${import.meta.env.VITE_SUFFIX}`} />
                <link rel="icon" href={logo} type="image/png" sizes="30x30" />
                <link rel="icon" href={logo} type="image/png" sizes="48x48" />
                <link rel="icon" href={logo} type="image/png" sizes="96x96" />
                <link rel="apple-touch-icon" href={logo} />

                {/* Open Graph cho Facebook */}
                <meta property="og:title" content={meta_title} />
                <meta property="og:description" content={meta_description} />
                <meta property="og:url" content={`${import.meta.env.VITE_BASE_URL}/${canonical}${import.meta.env.VITE_SUFFIX}`} />
                <meta property="og:type" content="website" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={meta_title} />
                <meta name="twitter:description" content={meta_description} />
            </Helmet>
        </>
    )
}

export default CustomHelmet