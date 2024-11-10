import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { Button } from './ui/button';
import { useClerk } from '@clerk/nextjs';

const Navbar = () => {
  // State to manage the navbar's visibility
  const [nav, setNav] = useState(false);
  const {signOut} = useClerk()
  // Toggle function to handle the navbar's display
  const handleNav = () => {
    setNav(!nav);
  };

  const handleLogOut = () => {
    signOut({ redirectUrl: '/sign-in' })
  }

  // Array containing navigation items
  const navItems: {id: number, text: string}[] = [
    {id: 1, text: "Logout"},
  ];

  return (
    <div className='bg-black flex justify-between items-center h-16 mx-auto px-4 text-white'>
      {/* Logo */}
      <h1 className='w-full text-3xl font-bold text-[#00df9a]'>STACKLAUNCH</h1>

      {/* Desktop Navigation */}
      <ul className='hidden md:flex'>
        {navItems.map(item => (
          <li key={item.id}>
          <Button onClick={() => handleLogOut()}>
            {item.text}
          </Button>
          </li>
        ))}
      </ul>

      {/* Mobile Navigation Icon */}
      <div onClick={handleNav} className='block md:hidden'>
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      {/* Mobile Navigation Menu */}
      <ul
        className={
          nav
            ? 'fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500'
            : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]'
        }
      >
        {/* Mobile Logo */}
        <h1 className='w-full text-2xl font-bold text-[#00df9a] m-4'>STACKLAUNCH</h1>

        {/* Mobile Navigation Items */}
        {navItems.map(item => (
          <li
            key={item.id}
            className='p-4 border-b rounded-xl hover:bg-[#00df9a] duration-300 hover:text-black cursor-pointer border-gray-600'
          >
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;