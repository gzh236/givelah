import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export const UploadImage = () => {
  <Upload>
    <Button icon={<UploadOutlined />}>Upload Image file</Button>
  </Upload>;
};
