import Link from "next/link";
import Image from "next/image";

export const HeaderLogo = () => {
    return (
        <Link href="/">
            <div className="items-center hidden lg:flex">
                <Image src="logo.svg" alt="Logo" height={100} width={100} />
                <p className="font-semibold text-white text-2xl ml-2.5">
                    Climate Construct
                </p>
            </div>
        </Link>
    );
};