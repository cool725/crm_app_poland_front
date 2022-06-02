import React, { useEffect, useState } from "react";

import { Button, message } from "antd";
import axios from "axios";
import AppLockAndText from "./AppLockAndText";

const AdminSetting: React.FC = () => {
  const [checked, setChecked] = useState<string>("");
  const [text, setText] = useState<any>("");

  const fetchSetting = async (key: string = "APP_LOCK") => {
    try {
      const res = await axios.get(`/settings/${key}`).then((res) => res.data);

      if (key === "APP_LOCK") {
        setChecked(res.value);
      } else {
        setText(res.value);
      }
    } catch (err) {
      console.log(err);
      message.error("Something went wrong. Please try again later.");
    }
  };

  const onChange = (key: string, value: boolean | string) => {
    if (key === "APP_LOCK") {
      setChecked(value ? "active" : "inactive");
    } else {
      setText(value);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios
        .post(`/settings`, { key: "APP_LOCK", value: checked })
        .then((res) => res.data);

      await axios
        .post(`/settings`, { key: "LOCK_TEXT", value: text })
        .then((res) => res.data);

      message.success("Saved successfully!");
    } catch (err) {
      console.log(err);
      message.error("Something went wrong. Please try again later.");
    }
  };

  useEffect(() => {
    fetchSetting("APP_LOCK");
    fetchSetting("LOCK_TEXT");
  }, []);

  return (
    <div className="container mx-auto p-36 flex items-center flex-col">
      <div className="bg-[#E1E8F1] rounded p-16 flex flex-col mb-3 w-96">
        <AppLockAndText checked={checked} text={text} onChange={onChange} />
      </div>

      <div className="w-96 text-right">
        <Button
          onClick={handleSubmit}
          className="btn-yellow hvr-float-shadow h-10 w-40"
        >
          SAVE
        </Button>
      </div>
    </div>
  );
};

export default AdminSetting;
