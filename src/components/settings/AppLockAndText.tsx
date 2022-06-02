import React from "react";
import { Switch, Input } from "antd";

interface CProps {
  checked: string;
  text: string;
  onChange: (key: string, value: string | boolean) => void;
}

const AppLockAndText: React.FC<CProps> = (props) => {
  const { checked, text, onChange } = props;

  return (
    <>
      <div className="mb-8">
        <span className="mr-3 text-c-blue font-semibold">
          Lock portal access for owners
        </span>
        <Switch
          size="small"
          className={checked === "active" ? "bg-[#1890ff]" : "bg-[#BFBFBF]"}
          checked={checked === "active" ? true : false}
          onChange={(checked) => onChange("APP_LOCK", checked)}
        />
      </div>

      <div>
        <Input.TextArea
          showCount
          maxLength={250}
          className="h-24"
          autoSize={{ minRows: 3 }}
          value={text}
          placeholder="Text of notification"
          onChange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => onChange("LOCK_TEXT", e.target.value)}
        />
      </div>
    </>
  );
};

export default AppLockAndText;
