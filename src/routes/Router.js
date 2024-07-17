import React from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import RiskManagement from "../pages/RiskManagement";

import Payouts from "../pages/Support/Payouts/Payouts";
import TraderOverview from "../pages/TraderOverview/Platform/TraderOverview";
import Signin from "../pages/Auth/Signin";
import AccountMetrics from "../pages/AccountMetrics";
import FundingEvaluation from "../pages/FundingEvaluation/FundingEvaluation";
import PageLayout from "../Layout/Layout";
import ViewLogTable from "../components/TraderOverview/ViewLogsTable/ViewLogTable";
import PayoutViewLogTable from "../pages/Support/Payouts/ViewLogsTable/PayoutViewLogTable";
import StageManager from "../pages/StageManager/StageManager";
import PublicRoutes from "./PublicRoutes";
import CountryWiseOverview from "../pages/CountryWiseOverview/CountryWiseOverview";
import RevenueManagement from "../pages/RevenueManagement/RevenueManagement";
import Funded from "../pages/Funded/Funded";
import FundedLogs from "../pages/Funded/FundedLogs/FundedLogs";
import Payment from "../pages/Payment/Payment";
import PaymentLogs from "../pages/Payment/PaymentLogs/PaymentLogs";
import PaymentExportHistory from "../pages/Payment/PaymentExportHistory/PaymentExportHistory";
import AffiliateMarketing from "../pages/AffiliateMarketing/AffiliateMarketing";
import AffiliateMarketingLogs from "../pages/AffiliateMarketing/AffiliateMarketingLogs/AffiliateMarketingLogs";
import AffiliateMarketingExportHistory from "../pages/AffiliateMarketing/AffiliateMarketingExportHistory/AffiliateMarketingExportHistory";
import UserSupport from "../pages/UserSupport/UserSupport";
import ChangeEmailLogs from "../pages/UserSupport/ChangeEmailLogs/ChangeEmailLogs";
import RequestPayout from "../pages/UserSupport/RequestPayout/RequestPayout";
import Competition from "../pages/Competition/Competition";
import CompetitionListLogs from "../pages/Competition/CompetitionListLogs/CompetitionListLogs";
import GeneralLog from "../pages/GeneralLog/GeneralLog";
import UserIPLogs from "../pages/List/UserIPList/UserIPLogs/UserIPLogs";
import UserIPList from "../pages/List/UserIPList/UserIPList";
import UserList from "../pages/List/UserList/UserList";
import UserListLogs from "../pages/List/UserList/UserIPLogs/UserListLogs";
import Coupon from "../pages/Coupon/Coupon";
import CouponLogs from "../pages/Coupon/CouponLogs/CouponLogs";
import KYC from "../pages/Compliance/KYC/KYC";
import Billing from "../pages/Compliance/Billing/Billing";
import UserProfile from "../pages/UserProfile/UserProfile";
import CreateAffiliateCode from "../components/AffiliateMarketing/CreateAffiliateCode/CreateAffiliateCode";
import CreateCoupon from "../pages/Coupon/CreateCoupon/CreateCoupon";
import FundingEvaluationLogs from "../pages/FundingEvaluation/FundingEvaluationLogs/FundingEvaluationLogs";
import CreateCompetition from "../pages/Competition/CreateCompetition/CreateCompetition";
import StageManager2 from "../pages/StageManager2/StageManager2";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}

        <Route element={<PublicRoutes />}>
          <Route
            path="/*"
            element={<Signin />}
          />
        </Route>

        {/* Public Routes */}

        {/* Private Routes */}

        <Route element={<PrivateRoutes />}>
          <Route
            exact={true}
            path="/"
            element={<Navigate to={"/trader-overview"} />}
          />

          <Route
            exact={true}
            path="/risk-management"
            element={
              <PageLayout headerName="Risk Mangement">
                <RiskManagement />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/trader-overview"
            element={
              <PageLayout headerName="Trader Overview">
                <TraderOverview />
              </PageLayout>
            }
          />
          <Route
            exact={true}
            path="/trader-overview/view-logs"
            element={
              <PageLayout headerName="Trader Overview">
                <ViewLogTable />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/support/payout"
            element={
              <PageLayout headerName="Payout">
                <StageManager />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/support/payout/payout-view-logs"
            element={
              <PageLayout headerName="Payout">
                <PayoutViewLogTable />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/account-analysis"
            element={
              <PageLayout headerName="Account Analysis">
                <AccountMetrics />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/funding-evaluation/*"
            element={
              <PageLayout headerName="Funding Evaluation">
                <FundingEvaluation />
              </PageLayout>
            }
          />
          <Route
            exact={true}
            path="/funding-evaluation/funding-evaluation-logs"
            element={
              <PageLayout headerName="Funding Evaluation">
                <FundingEvaluationLogs />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/support/stage-1"
            element={
              <PageLayout headerName="Support">
                <StageManager />
              </PageLayout>
            }
          />
          <Route
            exact={true}
            path="/support/stage-2"
            element={
              <PageLayout headerName="Support">
                <StageManager />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/country-wise-overview"
            element={
              <PageLayout headerName="Country Wise Overview">
                <CountryWiseOverview />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/revenue-management"
            element={
              <PageLayout headerName="Revenue Management">
                <RevenueManagement />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/support/funded"
            element={
              <PageLayout headerName="Funded">
                <StageManager />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/funded/funded-view-logs"
            element={
              <PageLayout headerName="Payout">
                <FundedLogs />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/payments"
            element={
              <PageLayout headerName="Payments">
                <Payment />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/payments/payments-view-logs"
            element={
              <PageLayout headerName="Payments">
                <PaymentLogs />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/payments/payments-export-history"
            element={
              <PageLayout headerName="Payments">
                <PaymentExportHistory />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/payments"
            element={
              <PageLayout headerName="Payments">
                <Payment />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/affiliate-marketing/*"
            element={
              <PageLayout headerName="Affiliate Marketing">
                <AffiliateMarketing />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/affiliate-marketing/create-affiliate-code"
            element={
              <PageLayout headerName="Affiliate Marketing">
                <CreateAffiliateCode />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/affiliate-marketing/affiliateMarketing-logs"
            element={
              <PageLayout headerName="Affiliate Marketing">
                <AffiliateMarketingLogs />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/affiliate-marketing/affiliateMarketing-exportHistory"
            element={
              <PageLayout headerName="Affiliate Marketing">
                <AffiliateMarketingExportHistory />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/user-support/*"
            element={
              <PageLayout headerName="User Support">
                <UserSupport />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/user-support/changeEmail-logs"
            element={
              <PageLayout headerName="User Support">
                <ChangeEmailLogs />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/user-support/request-payout"
            element={
              <PageLayout headerName="User Support">
                <RequestPayout />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/competitions"
            element={
              <PageLayout headerName="Competitions">
                <Competition />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/competitions/create-competition"
            element={
              <PageLayout headerName="Competitions">
                <CreateCompetition />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/competitions/competition-list-logs"
            element={
              <PageLayout headerName="Competitions">
                <CompetitionListLogs />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/general-log"
            element={
              <PageLayout headerName="General Log">
                <GeneralLog />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/list/user-ip-list"
            element={
              <PageLayout headerName="List">
                <UserIPList />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/list/user-ip-list/user-ip-logs"
            element={
              <PageLayout headerName="List">
                <UserIPLogs />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/list/user-list"
            element={
              <PageLayout headerName="List">
                <UserList />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/list/user-list/user-logs"
            element={
              <PageLayout headerName="List">
                <UserListLogs />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/list/user-list/user-logs"
            element={
              <PageLayout headerName="List">
                <UserListLogs />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/coupon"
            element={
              <PageLayout headerName="Coupon">
                <Coupon />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/coupon/create-coupon"
            element={
              <PageLayout headerName="Coupon">
                <CreateCoupon />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/coupon/coupon-logs"
            element={
              <PageLayout headerName="Coupon">
                <CouponLogs />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/compliance/kyc"
            element={
              <PageLayout headerName="Compliance">
                <KYC />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/compliance/billing"
            element={
              <PageLayout headerName="Compliance">
                <Billing />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/user-profile"
            element={
              <PageLayout headerName="User Profile">
                <UserProfile />
              </PageLayout>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
