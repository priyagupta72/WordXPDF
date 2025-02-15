import React from "react";

function Navbar() {
  return (
    <nav className="bg-gray-900 text-white shadow-lg fixed w-full z-50">
      <div className="max-w-screen-2xl mx-auto container px-6 py-4 md:px-40 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold cursor-pointer tracking-wide">
          Word<span className="text-blue-400 text-3xl">X</span>PDF
        </h1>

        <div className="space-x-6">
          <button className="text-lg font-semibold text-gray-300 hover:text-white hover:scale-110 transition duration-300">
            Home
          </button>
          {/* <button className="text-lg font-semibold text-gray-300 hover:text-white hover:scale-110 transition duration-300">
            About
          </button>
          <button className="text-lg font-semibold text-gray-300 hover:text-white hover:scale-110 transition duration-300">
            Contact
          </button> */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
