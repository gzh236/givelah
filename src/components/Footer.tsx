import { Layout } from "antd";

const { Footer } = Layout;

export const SiteFooter = () => {
  return (
    <Footer
      style={{
        textAlign: "center",
        backgroundColor: "#F0B7A4",
        position: "sticky",
        bottom: "0",
        width: "100%",
      }}
    >
      © Givelah
    </Footer>
  );
};
