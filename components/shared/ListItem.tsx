import React from "react";
import { Component } from "@/constants"; // Adjust the path as necessary
import { NavigationMenuLink } from "../ui/navigation-menu";

type ListItemProps = {
  title: Component["title"];
  tools: Component["tools"];
  children?: React.ReactNode;
};

const ListItem: React.FC<ListItemProps> = ({ title, tools, children }) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <div className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
          <div className="text-lg font-medium leading-none underline">
            {title}
          </div>
          <ul className="text-md leading-snug text-muted-foreground">
            {children}
          </ul>
        </div>
      </NavigationMenuLink>
    </li>
  );
};

export default ListItem;
