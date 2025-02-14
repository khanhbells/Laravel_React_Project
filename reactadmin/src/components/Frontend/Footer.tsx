import { useMenuContext } from "@/contexts/MenuContext"
import { useSystemContext } from "@/contexts/SystemContext"
import { writeUrl } from "@/helper/myHelper"
import { useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { LoadingSpinner } from "../ui/loading"
const Footer = () => {
    const { isDataSystems } = useSystemContext()
    const { isDataMenus } = useMenuContext()
    const footerData = useMemo(() => {
        if (isDataMenus) {
            return [
                {
                    title: 'Dịch vụ khám',
                    subItems: isDataMenus.specialty_catalogues,
                    model: 'specialty'
                },
                {
                    title: 'Cơ sở y tế',
                    subItems: isDataMenus.hospitals,
                    model: 'hospital'
                },
                {
                    title: 'Bài viết',
                    subItems: isDataMenus.post_catalogues,
                    model: 'post'
                },
            ]
        }
        return []
    }, [isDataMenus])
    return (
        <>
            <footer aria-labelledby="footer-heading" className="bg-white grid">
                <p className="sr-only" id="footer-heading">Footer</p>
                <div className="mx-auto px-4 py-20 max-w-screen-2xl">
                    <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                        <div className="mt-10 xl:mt-0">
                            <p className="text-sm font-semibold leading-6 text-black">{isDataSystems && isDataSystems.homepage_brand}</p>
                            <p className="mt-2 text-sm leading-6 text-gray-800">{isDataSystems && isDataSystems.homepage_slogan}</p>
                            <form className="mt-6 sm:flex sm:max-w-md">
                                <label htmlFor="email-address" className="sr-only">Email address</label>
                                <input type="email" placeholder="Nhập email của bạn..." name="email-address" autoComplete="email" required
                                    className="min-w-0 appearance-none border-0 ring-1 ring-inset ring-white/10 placeholder:text-gray-500
              focus:ring-2 focus:ring-inset focus:ring-black focus:outline-none w-full rounded-md bg-gray-50 px-3 py-1.5
              text-base text-black shadow-sm sm:w-64 sm:text-sm sm:leading-6 xl:w-full" id="email-address" />
                                <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
                                    <button type="submit" className="flex hover:bg-black focus-visible:outline
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black w-full items-center
                justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white
                shadow-sm">Đăng ký</button>
                                </div>
                            </form>
                        </div>
                        <div className="mt-10 xl:mt-0 xl:col-span-2 grid grid-cols-2 gap-8">
                            <div className="md:grid md:grid-cols-2 md:gap-8">
                                <div>
                                    <p className="text-sm font-semibold leading-6 text-black">Dịch vụ khám</p>
                                    <ul role="list" className="mt-6 space-y-4">
                                        {
                                            isDataMenus && isDataMenus.specialty_catalogues.length > 0 ? isDataMenus.specialty_catalogues.map((value: any, index: number) =>
                                            (
                                                <li key={value.id}>
                                                    <Link to={writeUrl(value.canonical, 'specialty', value.id)} className="text-sm leading-6 text-gray-800 hover:text-black">
                                                        {value.name}
                                                    </Link>
                                                </li>
                                            )
                                            ) :
                                                (
                                                    <div className="flex items-center justify-center w-full">
                                                        <LoadingSpinner className="mr-[5px]" />
                                                        Loading...
                                                    </div>
                                                )
                                        }
                                    </ul>
                                </div>
                                <div className="mt-10 md:mt-0">
                                    <p className="text-sm font-semibold leading-6 text-black">Cơ sở y tế</p>
                                    <ul role="list" className="mt-6 space-y-4">
                                        {
                                            isDataMenus && isDataMenus.hospitals.length > 0 ? isDataMenus.hospitals.map((value: any, index: number) =>
                                            (
                                                <li key={value.id}>
                                                    <Link to={writeUrl(value.canonical, 'hospital', value.id)} className="text-sm leading-6 text-gray-800 hover:text-black">
                                                        {value.name}
                                                    </Link>
                                                </li>
                                            )
                                            ) :
                                                (
                                                    <div className="flex items-center justify-center w-full">
                                                        <LoadingSpinner className="mr-[5px]" />
                                                        Loading...
                                                    </div>
                                                )
                                        }
                                    </ul>
                                </div>
                            </div>
                            <div className="md:grid md:grid-cols-2 md:gap-8">
                                <div>
                                    <p className="text-sm font-semibold leading-6 text-black">Bài viết</p>
                                    <ul role="list" className="mt-6 space-y-4">
                                        {
                                            isDataMenus && isDataMenus.post_catalogues.length > 0 ? isDataMenus.post_catalogues.map((value: any, index: number) =>
                                            (
                                                <li key={value.id}>
                                                    <Link to={writeUrl(value.canonical, 'post', value.id)} className="text-sm leading-6 text-gray-800 hover:text-black">
                                                        {value.name}
                                                    </Link>
                                                </li>
                                            )
                                            ) :
                                                (
                                                    <div className="flex items-center justify-center w-full">
                                                        <LoadingSpinner className="mr-[5px]" />
                                                        Loading...
                                                    </div>
                                                )
                                        }
                                    </ul>
                                </div>
                                <div className="mt-10 md:mt-0">
                                    <p className="text-sm font-semibold leading-6 text-black">Liên hệ</p>
                                    <ul role="list" className="mt-6 space-y-4">
                                        <li>
                                            <a href="#" className="text-sm leading-6 text-gray-800 hover:text-black">About</a>
                                        </li>
                                        <li>
                                            <a href="#" className="text-sm leading-6 text-gray-800 hover:text-black">Privacy</a>
                                        </li>
                                        <li>
                                            <a href="#" className="text-sm leading-6 text-gray-800 hover:text-black">Terms</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-16 pt-8 sm:mt-20 md:flex md:items-center md:justify-between lg:mt-24 border-t border-white/10">
                        <div className="md:order-2 flex space-x-6">
                            <a href={isDataSystems && isDataSystems.social_facebook} className="text-black hover:text-gray-700">
                                <span className="sr-only">Facebook</span>
                                <svg
                                    className="h-6 w-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    id="Windframe_vlminL7Qt7MO"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438
                9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195
                2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22
                16.991 22 12z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </a>
                            <a href={isDataSystems && isDataSystems.social_instagram} className="text-black hover:text-gray-700">
                                <span className="sr-only">Instagram</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" id="Windframe_HVLPQ3n-Mj46">
                                    <path fillRule="evenodd"
                                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0
                011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0
                2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0
                01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643
                0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0
                01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                        clipRule="evenodd"></path>
                                </svg>
                            </a>
                            <a href="#" className="text-black hover:text-gray-700">
                                <span className="sr-only">GitHub</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" id="Windframe_Hi0vTCPMTr5Z">
                                    <path fillRule="evenodd"
                                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839
                9.504.5.092.682-.217.682-.483
                0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                        clipRule="evenodd"></path>
                                </svg>
                            </a>
                            <a href={isDataSystems && isDataSystems.social_youtube} className="text-black hover:text-gray-700">
                                <span className="sr-only">YouTube</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" id="Windframe_mgkOvdPknMdW">
                                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418
                4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0
                1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998
                5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd"></path>
                                </svg>
                            </a>
                        </div>
                        <p className="mt-8 text-xs leading-5 text-gray-400 md:order-1 md:mt-0">{isDataSystems && isDataSystems?.homepage_copyright}</p>
                    </div>
                </div>
            </footer>
        </>
    )
}
export default Footer