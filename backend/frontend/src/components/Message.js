import React from "react";
import { Alert } from "react-bootstrap";

function Message({ variant, children }) {
  return (
    <Alert
      style={{
        backgroundColor: "rgba(0,0,0,0.1)",
        color: "bisque",
      }}
      variant={variant}
    >
      {children}
    </Alert>
  );
}

export default Message;
