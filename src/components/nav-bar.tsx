'use client'
import React, { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Button } from "./ui/button";
import { useClerk } from "@clerk/nextjs";
import { LogOut, LogOutIcon } from "lucide-react";

const Navbar = () => {
  // State to manage the navbar's visibility
  const [nav, setNav] = useState(false);
  const { signOut } = useClerk();
  // Toggle function to handle the navbar's display
  const handleNav = () => {
    setNav(!nav);
  };

  const handleLogOut = () => {
    signOut({ redirectUrl: "/sign-in" });
  };

  // Array containing navigation items
  const navItems: { id: number; text: string }[] = [{ id: 1, text: "Logout" }];

  return (
    <div className="container flex mx-auto h-16 items-center justify-between bg-black px-4 text-white">
      {/* Logo */}
      <h1 className="w-full text-3xl font-bold text-[#00df9a]">STACKLAUNCH_</h1>
      {/* Desktop Navigation */}
      <ul className="hidden md:flex">
        {navItems.map((item) => (
          <li key={item.id}>
            <Button
              onClick={() => handleLogOut()}
              variant="outline"
              size="icon"
            >
              <LogOut />
            </Button>
          </li>
        ))}
      </ul>

      {/* Mobile Navigation Icon */}
      <div onClick={handleNav} className="block md:hidden">
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      {/* Mobile Navigation Menu */}
      <ul
        className={
          nav
            ? "fixed left-0 top-0 h-full w-[60%] border-r border-r-gray-900 bg-[#000300] duration-500 ease-in-out md:hidden"
            : "fixed bottom-0 left-[-100%] top-0 w-[60%] duration-500 ease-in-out"
        }
      >
        {/* Mobile Logo */}
        <h1 className="m-4 w-full text-2xl font-bold text-[#00df9a]">
          STACKLAUNCH_
        </h1>

        {/* Mobile Navigation Items */}
        {navItems.map((item) => (
          <li
            key={item.id}
            className="cursor-pointer rounded-xl border-b border-gray-600 p-4 duration-300 hover:bg-[#00df9a] hover:text-black"
          >
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
