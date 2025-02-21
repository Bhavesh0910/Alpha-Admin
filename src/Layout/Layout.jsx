import React, {useEffect, useState} from "react";
import {CloseCircleOutlined, DesktopOutlined, FileOutlined, MenuOutlined, PieChartOutlined, TeamOutlined, UserOutlined} from "@ant-design/icons";
import {Button, Drawer, Layout, Menu, Space} from "antd";
import "./Layout.scss";
import logo from "../assets/icons/logo.svg";
import profilePic from "../assets/icons/userProfilePic.svg";
import {useNavigate, useLocation, Link} from "react-router-dom";
import {ReactComponent as Logout} from "../assets/icons/logout.svg";
import {clearPersistedData} from "../store/configureStore";
import {setAuthenticationStatus} from "../store/NewReducers/authSlice";
import {useDispatch, useSelector} from "react-redux";
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
import {ReactComponent as AdvanceIcon} from "../assets/icons/advance.svg";
import {ReactComponent as MoreIcon} from "../assets/icons/more-adv.svg";
import {ReactComponent as PassAndFailedIcon} from "../assets/icons/passandfail.svg";
import {ReactComponent as DashIcon} from "../assets/icons/dash.svg";
import {ReactComponent as CertificateIcon} from "../assets/icons/certificates.svg";

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
    // children:[
    //   {
    //     key:"4-1",
    //     // label:"View logs",
    //     link:"/trader-overview/view-logs"
    //   }
    // ]
  },
  // {
  //   key: "5",
  //   icon: <StageManagerIcon />,
  //   label: "Stage Manager",
  //   link: "/stage-manager",
  // },
  // {
  //   key: "6",
  //   icon: <SupportIcon />,
  //   label: "Support",
  //   children: [
  //     {
  //       key: "6-1",
  //       label: "Stage 1 Pass",
  //       link: "/support/stage-1",
  //     },
  //     {
  //       key: "6-2",
  //       label: "Stage 2 Pass",
  //       link: "/support/stage-2",
  //     },
  //     {
  //       key: "6-3",
  //       label: "Funded",
  //       link: "/support/funded",
  //     },
  //     {
  //       key: "6-4",
  //       label: "Payout",
  //       link: "/support/payout",
  //     },
  //   ],
  // },
  {
    key: "6",
    icon: <SupportIcon />,
    label: "Support",
    children: [
      {
        key: "6-1",
        label: "Step 1",
        link: "/support/step-1",
      },
      {
        key: "6-2",
        label: "Step 2",
        link: "/support/step-2",
      },
      {
        key: "6-5",
        label: "Step 3",
        link: "/support/step-3",
      },
      {
        key: "6-3",
        label: "Funded",
        link: "/support/funded",
      },
      {
        key: "6-4",
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
    key: "18",
    icon: <AdvanceIcon />,
    label: "Advance Statistics",
    link: "/advance-statistics/withdrawal-status",
    children: [
      {
        key: "18-1",
        label: "Withdrawal Status",
        link: "/advance-statistics/withdrawal-status",
      },
      {
        key: "18-2",
        label: "Approved Withdrawal",
        link: "/advance-statistics/withdrawal-details",
      },
      {
        key: "18-3",
        label: "Passes Rates",
        link: "/advance-statistics/pass-rates",
      },
      {
        key: "18-4",
        label: "Daily Stats",
        link: "/advance-statistics/daily-stats",
      },
      {
        key: "18-5",
        label: "Payout",
        link: "/advance-statistics/payout",
      },
    ],
  },
  {
    key: "19",
    icon: <CertificateIcon />,
    label: "Certificates",
    link: "/certificates",
    children: [
      // {
      //   key: "19-1",
      //   label: "All Certificates",
      //   link: "/certificates/all-certificates",
      // },
      {
        key: "19-2",
        label: "Create Certificates",
        link: "/certificates/create-certificates",
      },
    ],
  },
  // {
  //   key: "20",
  //   icon: <CompetitionIcon />,
  //   label: "Permissions",
  //   link: "/permissions/",
  // },
  // {
  //   key: "19",
  //   icon: <MoreIcon />,
  //   label: "More Advance Statistics",
  //   link: "/advance-statistics/trading-pairs",
  // },
  // {
  //   key: "20",
  //   icon: <PassAndFailedIcon />,
  //   label: "Passed And Failed",
  //   link: "/advance-statistics/passed-and-failed",
  // },
  // {
  //   key: "21",
  //   icon: <DashIcon />,
  //   label: "Dash Stats",
  //   link: "/advance-statistics/dash-stats",
  // },
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
  const userDetails = useSelector((state) => state.user);

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
      case "/trader-overview/view-logs":
        return "4";
      case "/stage-manager":
        return "5";
      case "/support/step-1":
        return "6-1";
      case "/support/step-1/logs":
        return "6-1";
      case "/support/step-2":
        return "6-2";
      case "/support/step-2/logs":
        return "6-2";
      case "/support/step-3":
        return "6-5";
      case "/support/funded":
        return "6-3";
      case "/funded/funded-view-logs":
        return "6-3";
      case "/support/payout":
        return "6-4";
      case "/support/payout/payout-view-logs":
        return "6-4";
      case "/funding-evaluation":
        return "7-1";
      case "/payments":
        return ["8"];
      case "/payments/payments-view-logs":
        return ["8"];
      case "/payments/payments-export-history":
        return ["8"];
      case "/affiliate-marketing":
        return ["9"];
      case "/affiliate-marketing/logs":
        return ["9"];
      case "/affiliate-marketing/create-affiliate-code":
        return ["9"];
      case "/affiliate-marketing/affiliateMarketing-logs":
        return ["9"];
      case "/user-support":
        return ["10"];
      case "/user-support/changeEmail-logs":
        return ["10"];
      case "/coupon":
        return ["13"];
      case "/coupon/coupon-logs":
        return ["13"];
      case "/coupon/create-coupon":
        return ["13"];
      case "/general-log":
        return ["14"];
      case "/list/user-ip-list":
        return ["15", "15-2"];
      case "/list/user-ip-list/user-ip-logs":
        return ["15", "15-2"];
      case "/list/user-list":
        return ["15", "15-1"];
      case "/list/user-list/user-logs":
        return ["15", "15-1"];
      case "/compliance/kyc":
        return ["16", "16-1"];
      case "/compliance/billing":
        return ["16", "16-2"];
      case "/competitions":
        return ["17"];
      case "/competitions/competition-list-logs":
        return ["17"];
      case "/competitions/create-competition":
        return ["17"];
      case "/advance-statistics/withdrawal-status":
        return ["18", "18-1"];
      case "/advance-statistics/withdrawal-status/export-history":
        return ["18", "18-1"];
      case "/advance-statistics/withdrawal-details":
        return ["18", "18-2"];
      case "/advance-statistics/pass-rates":
        return ["18", "18-3"];
      case "/advance-statistics/export-history":
        return ["18", "18-3"];
      case "/advance-statistics/daily-stats":
        return ["18", "18-4"];
      case "/advance-statistics/daily-stats/export-history":
        return ["18", "18-4"];
      case "/advance-statistics/payout":
        return ["18", "18-5"];
      case "/advance-statistics/payout-export-history":
        return ["18", "18-5"];
      case "/certificates":
        return ["19"];
      case "/certificates/all-certificates":
        return ["19", "19-1"];
      case "/certificates/create-certificates":
        return ["19", "19-2"];
      case "/certificates/create-certificates/view-logs":
        return ["19", "19-2"];
      // case "/advance-statistics/trading-pairs":
      //   return ["19"];
      // case "/advance-statistics/passed-and-failed":
      //   return ["20"];
      // case "/advance-statistics/dash-stats":
      //   return ["21"];

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
          zIndex: 11111,
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
          <h1>{headerName}</h1>
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

        <Header className="main_header_section">
          <h1>{headerName}</h1>
          <Link to={"/user-profile"}>
            <div className="user_profile">
              <img
                src={profilePic}
                alt=""
              />
              <p>{userDetails?.first_name}</p>
            </div>
          </Link>
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
