import React from "react";
import { Link } from "react-router-dom";

const SmartLink = ({ to, children, ...props }) => {
  // Check if the URL is external
  const isExternal = /^https?:\/\//.test(to);

  if (isExternal) {
    // Use <a> for external links
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }

  // Use <Link> for internal navigation
  return (
    <Link to={to} {...props}>
      {children}
    </Link>
  );
};

export default SmartLink;
