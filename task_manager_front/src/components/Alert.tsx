import { FC } from "react";

interface AlertProps {
  message: string;
  type: string;
}

const Alert: FC<AlertProps> = ({ message, type }) => {
  const classType = `alert alert-${type}`;
  return (
    <div
      className="d-flex justify-content-center align-items-center position-fixed start-50 translate-middle-x w-50"
      style={{ top: "10px", zIndex: 1000 }}
    >
      <div className={classType} role="alert">
        {message}
      </div>
    </div>
  );
};

export default Alert;
