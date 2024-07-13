import React, {useEffect, useState} from "react";
import {CloseCircleOutlined, DesktopOutlined, FileOutlined, MenuOutlined, PieChartOutlined, TeamOutlined, UserOutlined} from "@ant-design/icons";
import {Button, Drawer, Layout, Menu, Space} from "antd";
import "./Layout.scss";
import logo from "../assets/icons/logo.svg";
import {useNavigate, useLocation} from "react-router-dom";
import {ReactComponent as Logout} from "../assets/icons/logout.svg";
import {clearPersistedData} from "../store/configureStore";
import {setAuthenticationStatus} from "../store/reducers/authSlice";
import {useDispatch} from "react-redux";
import {returnErrors} from "../store/reducers/error";
import {deAuthenticateAll} from "../store/NewReducers/logout";
import {ReactComponent as RiskManagementIcon} from "../assets/icons/riskManagementIcon.svg";
import {ReactComponent as RevenueManagementIcon} from "../assets/icons/revenueManagementIcon.svg";
import {ReactComponent as CountryWiseIcon} from "../assets/icons/countryWiseIcon.svg";
import {ReactComponent as TraderOverviewIcon} from "../assets/icons/traderOverviewMenu.svg";
import {ReactComponent as SupportIcon} from "../assets/icons/supportIcon.svg";
import {ReactComponent as StageManagerIcon} from "../assets/icons/stageManagerIcon.svg";
import {ReactComponent as FundingEvaluationIcon} from "../assets/icons/fundingEvaluationIcon.svg";
import {ReactComponent as PaymentsIcon} from "../assets/icons/paymentsIcon.svg";
import {ReactComponent as AffiliateIcon} from "../assets/icons/affiliateIcon.svg";
import {ReactComponent as UserSupportIcon} from "../assets/icons/userSupportIcon.svg";
import {ReactComponent as CompetitionIcon} from "../assets/icons/competitionIcon.svg";
import {ReactComponent as GeneralLogIcon} from "../assets/icons/generalLogIcon.svg";
import {ReactComponent as CouponIcon} from "../assets/icons/couponIcon.svg";
import {ReactComponent as ListIcon} from "../assets/icons/listIcon.svg";
import {ReactComponent as ComplianceIcon} from "../assets/icons/complianceIcon.svg";

const {Header, Sider, Content} = Layout;

const items = [
  {
    key: "1",
    icon: <RiskManagementIcon />,
    label: "Risk Management",
    link: "/risk-management",
  },
  {
    key: "2",
    icon: <RevenueManagementIcon />,
    label: "Revenue Management",
    link: "/revenue-management",
  },
  {
    key: "3",
    icon: <CountryWiseIcon />,
    label: "County Wise Overview",
    link: "/country-wise-overview",
  },
  {
    key: "4",
    icon: <TraderOverviewIcon />,
    label: "Trader Overview",
    link: "/trader-overview",
  },
  {
    key: "5",
    icon: <StageManagerIcon />,
    label: "Stage Manager",
    link: "/stage-manager",
  },
  {
    key: "6",
    icon: <SupportIcon />,
    label: "Support",
    children: [
      {
        key: "6-1",
        label: "Stage 1",
        link: "/support/stage-1",
      },
      {
        key: "6-2",
        label: "Funded",
        link: "/support/funded",
      },
      {
        key: "6-3",
        label: "Payout",
        link: "/support/payout",
      },
    ],
  },
  {
    key: "7",
    icon: <FundingEvaluationIcon />,
    label: "Funding Evaluation",
    children: [
      {
        key: "7-1",
        label: "Create Trading Account",
        link: "/funding-evaluation",
      },
    ],
  },
  {
    key: "8",
    icon: <PaymentsIcon />,
    label: "Payments",
    link: "/payments",
  },
  {
    key: "9",
    icon: <AffiliateIcon />,
    label: "Affiliate Marketing",
    link: "/affiliate-marketing",
  },
  {
    key: "10",
    icon: <UserSupportIcon />,
    label: "User Support",
    link: "/user-support",
  },
  {
    key: "13",
    icon: <CouponIcon />,
    label: "Coupons",
    link: "/coupon",
  },
  {
    key: "14",
    icon: <GeneralLogIcon />,
    label: "General Logs",
    link: "/general-log",
  },
  {
    key: "15",
    icon: <ListIcon />,
    label: "Lists",
    link: "/list/user-ip-list",
    children: [
      {
        key: "15-1",
        label: "User List",
        link: "/list/user-list",
      },
      {
        key: "15-2",
        label: "IP List",
        link: "/list/user-ip-list",
      },
    ],
  },
  {
    key: "16",
    icon: <ComplianceIcon />,
    label: "Compliance",
    link: "/compliance/kyc",
    children: [
      {
        key: "16-1",
        label: "KYC",
        link: "/compliance/kyc",
      },
      {
        key: "16-2",
        label: "Billing",
        link: "/compliance/billing",
      },
    ],
  },
  {
    key: "17",
    icon: <CompetitionIcon />,
    label: "Competition",
    link: "/competitions/",
  },
  {
    key: "12",
    icon: <Logout />,
    label: "Logout",
    link: "/signup",
  },
];

const PageLayout = ({headerName, children}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleMouseEnter = () => {
    setIsSidebarOpen(true);
  };

  const handleMouseLeave = () => {
    setIsSidebarOpen(false);
    setOpenKeys([]);
  };

  const handleMenuClick = ({key}) => {
    const selectedItem = items.find((item) => item.key === key);

    if (key === "12") {
      deAuthenticateAll(dispatch);
      clearPersistedData()
        .then(() => {
          dispatch(setAuthenticationStatus(false));
          navigate("/signin");
        })
        .catch((err) => {
          dispatch(returnErrors(err?.response?.details || "Error while Logging out!", 400));
        });
    }
    if (selectedItem && selectedItem.link) {
      navigate(selectedItem.link);
    }
  };

  useEffect(() => {
    const key = (() => {
      switch (location.pathname) {
        case "/trader-overview":
          return "4";
        case "/stage-manager":
          return "5";
        case "/support/payout":
          return "6-3";
        case "/funding-evaluation":
          return "7-1";
        default:
          return null;
      }
    })();

    if (key) {
      handleMenuClick({key});
    }
  }, [location.pathname]);

  const handleSubMenuClick = ({key}) => {
    const selectedChildItem = items
      .filter((item) => item.children)
      .map((item) => item.children)
      .flat()
      .find((child) => child.key === key);

    if (selectedChildItem && selectedChildItem.link) {
      navigate(selectedChildItem.link);
    }
  };

  const showDrawer = () => {
    setOpen(!open);
  };

  const onClose = () => {
    setOpen(false);
  };

  const selectedKeys = (() => {
    switch (location.pathname) {
      case "/risk-management":
        return "1";
      case "/revenue-management":
        return "2";
      case "/country-wise-overview":
        return "3";
      case "/trader-overview":
        return "4";
      case "/stage-manager":
        return "5";
      case "/support/payout":
        return "6-3";
      case "/funding-evaluation":
        return "7-1";
      case "/payments":
        return ["8"];
      case "/affiliate-marketing":
        return ["9"];
      case "/user-support":
        return ["10"];
      case "/coupon":
        return ["13"];
      case "/general-log":
        return ["14"];
      case "/list/user-ip-list":
        return ["15", "15-2"];
      case "/list/user-list":
        return ["15", "15-1"];
      case "/compliance/kyc":
        return ["16", "16-1"];
      case "/compliance/billing":
        return ["16", "16-2"];
      case "/competitions/":
        return ["17"];
      default:
        return null;
    }
  })();

  return (
    <Layout style={{minHeight: "100vh"}}>
      <Sider
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        collapsed={!isSidebarOpen}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 1000,
        }}
      >
        <div className="logo-container">
          <img
            src={logo}
            alt="Logo"
            className="sidebar-logo"
            onClick={() => navigate("/trader-overview")}
            style={{cursor: "pointer"}}
          />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          onClick={handleMenuClick}
          onOpenChange={(keys) => setOpenKeys(keys)}
          openKeys={isSidebarOpen ? openKeys : []}
          onSelect={handleSubMenuClick}
          selectedKeys={selectedKeys}
        >
          {items.map((item) => {
            if (item.children) {
              return (
                <Menu.SubMenu
                  key={item.key}
                  icon={item.icon}
                  title={item.label}
                >
                  {item.children.map((child) => (
                    <Menu.Item
                      className="nestedItems"
                      key={child.key}
                    >
                      {child.label}
                    </Menu.Item>
                  ))}
                </Menu.SubMenu>
              );
            }
            return (
              <Menu.Item
                key={item.key}
                icon={item.icon}
              >
                {item.label}
              </Menu.Item>
            );
          })}
        </Menu>
      </Sider>
      <Layout
        style={{
          marginLeft: isSidebarOpen ? 200 : 80,
          transition: "margin-left 0.2s",
        }}
      >
        <div className="mobile_menu_header">
          <img
            src={logo}
            alt="company_logo"
            onClick={() => navigate("/trader-overview")}
          />
          <Button
            type="primary"
            onClick={showDrawer}
          >
            {open ? <CloseCircleOutlined /> : <MenuOutlined />}
          </Button>
          <Drawer
            title="Basic Drawer"
            placement="left"
            closable={false}
            onClose={onClose}
            open={open}
            key="left"
            extra={<Space></Space>}
          >
            <Menu
              theme="dark"
              mode="inline"
              onClick={handleMenuClick}
              onOpenChange={(keys) => setOpenKeys(keys)}
              openKeys={open ? openKeys : []}
              onSelect={handleSubMenuClick}
              selectedKeys={selectedKeys}
              className="mobile_menu_container"
            >
              {items.map((item) => {
                if (item?.children) {
                  return (
                    <Menu.SubMenu
                      key={item.key}
                      icon={item.icon}
                      title={item.label}
                    >
                      {item?.children.map((child) => (
                        <Menu.Item
                          className="nestedItems"
                          onClick={onClose}
                          key={child.key}
                        >
                          {child.label}
                        </Menu.Item>
                      ))}
                    </Menu.SubMenu>
                  );
                }
                return (
                  <Menu.Item
                    onClick={!item?.children && onClose}
                    key={item.key}
                    icon={item.icon}
                  >
                    {item.label}
                  </Menu.Item>
                );
              })}
            </Menu>
          </Drawer>
        </div>

        <Header style={{padding: "20px", background: "#12181F", display: "flex", alignItems: "center", height: "109px"}}>
          <h1>{headerName}</h1>
        </Header>
        <Content
          style={{
            margin: "30px 40px",
            padding: 24,
            minHeight: 280,
            borderRadius: "20px",
            // border: "1px solid var(--Stroke, #252A29)",
            background: "var(--second-Background, #27313E)",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default PageLayout;
