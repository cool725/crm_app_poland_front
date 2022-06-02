import { Modal, Button } from "antd";

interface CProps {
  text: string;
  visible: boolean;
  onCancel: () => void;
}

const InformStatusModal: React.FC<CProps> = (props) => {
  return (
    <Modal
      closable={true}
      visible={props.visible}
      footer={false}
      width={800}
      centered
      className="modal-confirm"
      onCancel={() => props.onCancel()}
    >
      <div className="px-5 mt-6 flex flex-col items-center">
        <div className="text-center text-base mb-20">{props.text}</div>
        <Button
          htmlType="submit"
          size="large"
          className="btn-yellow hvr-float-shadow w-1/2 h-13 mx-auto"
          onClick={() => props.onCancel()}
        >
          OK
        </Button>
      </div>
    </Modal>
  );
};

export default InformStatusModal;
