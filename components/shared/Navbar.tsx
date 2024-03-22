"use client";

import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { components } from "@/constants";
import ListItem from "./ListItem";

const Navbar = () => {
  return (
    <nav className="bg-red-100 fixed p-4 flex justify-between items-center w-full shadow-md">
      <div
        className="cursor-pointer"
        onClick={() => window.location.replace("/")}
      >
        <span className="text-2xl md:text-4xl font-extrabold text-black">
          RePixify
        </span>
      </div>
      <div className="flex-grow flex justify-center items-center">
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-4 md:space-x-8">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-lg">
                Features
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-green-100">
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      tools={component.tools}
                    >
                      {component.tools.map((tool, index) => (
                        <li key={index}>
                          <a
                            href={tool.href}
                            className="hover:font-semibold transition-transform duration-300 hover:scale-110"
                          >
                            {tool.name}
                          </a>
                        </li>
                      ))}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="/pricing"
                className="hover:font-semibold transition-colors duration-150"
              >
                Pricing
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="/blog"
                className="hover:font-semibold transition-colors duration-150"
              >
                Blog
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="#about"
                className="hover:font-semibold transition-colors duration-150"
              >
                About Us
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="#contact"
                className="hover:font-semibold transition-colors duration-150"
              >
                Contact Us
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>

          <NavigationMenuViewport />
        </NavigationMenu>
      </div>
      <div>
        <a href="/sign-in">
          <button className="text-blue-900 tracking-widest bg-yellow-500 hover:bg-yellow-600 rounded-lg text-md px-5 py-2 font-bold transition-colors duration-150">
            Login
          </button>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
