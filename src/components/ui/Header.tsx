'use client';
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/logo.png";

export default function Header() {
  return (
    <header className="flex items-center justify-between h-[80px] px-6 bg-black/40 backdrop-blur-md shadow-md fixed w-full z-50">
      <div className="flex items-center space-x-6 h-full">
        <Image src={logo} alt="Logo" width={130} height={32} className="object-contain" />
        <nav className="flex space-x-8 text-white font-medium text-base h-full items-center">
          <Link
            href="#"
            className="transition duration-300 hover:text-pink-500 hover:underline underline-offset-4"
          >
            Home
          </Link>
          <Link
            href="#"
            className="transition duration-300 hover:text-pink-500 hover:underline underline-offset-4"
          >
            Levels
          </Link>
        </nav>
      </div>
    </header>
  );
}
