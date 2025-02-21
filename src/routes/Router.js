import React from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import RiskManagement from "../pages/RiskManagement";

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
import AffiliateMarketingCode from "../pages/AffiliateMarketing/AffiliateMarketingCode/AffiliateMarketingCode";
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
import Stage1Logs from "../pages/StageManager/Stage1Logs";
import Stage2Logs from "../pages/StageManager2/Stage2Logs";
import AffiliateLogs from "../pages/AffiliateMarketing/Logs/AffiliateLogs";
import WithdrawalStatus from "../pages/AdvanceStatistics/WithdrawalStatus/WithdrawalStatus";
import WithdrawalStatusExportHistory from "../pages/AdvanceStatistics/WithdrawalStatus/WithdrawalStatusExport";
import WithdrawalDetails from "../pages/AdvanceStatistics/WithdrawalDetails/WithdrawalDetails";
import WithdrawalDetailsExportHistory from "../pages/AdvanceStatistics/WithdrawalDetails/WithdrawalDetailsExport";
import PassRates from "../pages/AdvanceStatistics/PassRates/PassRates";
import ExportHistoryTable from "../pages/AdvanceStatistics/PassRates/ExportHistoryTable";
import Payout from "../pages/AdvanceStatistics/Payout/Payout";
import PayoutExportHistory from "../pages/AdvanceStatistics/Payout/PayoutExportHistory";
import DailyStats from "../pages/AdvanceStatistics/DailyStats/DailyStats";
import TradingPairs from "../pages/MoreAdvancedStatistics/TradingPairs/TradingPairs";
import PassAndFailed from "../pages/PassedAndFailed/PassAndFailed";
import DashStats from "../pages/DashStats/DashStats";
import DashStatsExportHistory from "../pages/DashStats/DashStatsExportHistory";
import DailyStatsExportHistory from "../pages/AdvanceStatistics/DailyStats/DailyStatsExport";
import AffiliateRefList from "../pages/AffiliateMarketing/AffiliateRefList/AffiliateRefList";
import OverView from "../pages/RiskManagement/NewPages/Overview/Overview";
import TradingStats from "../pages/RiskManagement/NewPages/Trading stats/index";
import TradingTagList from "../pages/RiskManagement/NewPages/TradingTagList";
import NewRiskManagement from "../pages/RiskManagement/NewPages";
import AllCertificates from "../pages/Certificates/AllCertificates";
import CreateCertificates from "../pages/Certificates/CreateCertificates";
import CreateCertificateViewLogs from "../pages/Certificates/CreateCertificates/Logs";
import Permissions from "../pages/Permissions/Permissions";
import AddValueForm from "../components/FundingEvaluation/AddNewForm";
import Affiliate from "../pages/AffiliateMarketing/Affiliate";
import LeaderBoard from "../pages/Competition/LeaderBoard/Index";
import PayoutReview from "../pages/Support/PayoutReview/PayoutReview";
import StepOne from "../pages/StageManager/Step1/StepOne";
import StepTwo from "../pages/StageManager/Step2/StepTwo";
import StepThree from "../pages/StageManager/Step3/StepThree";
import StepThreeLogs from "../pages/StageManager/Step3/StepThreeLogs";
// import Stage1 from "../pages/NewStageManager/Stage1";
// import Stage2 from "../pages/NewStageManager/Stage2";
// import NewFunded from "../pages/NewStageManager/Funded";
// import Payouts from "../pages/NewStageManager/Payouts";

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
              <PageLayout headerName="Risk Management">
                <RiskManagement />
              </PageLayout>
            }
          />
          {/* <Route
            exact={true}
            path="/risk-management/overview"
            element={
              <PageLayout headerName="Risk Mangement">
                <OverView />
              </PageLayout>
            }
          />
          <Route
            exact={true}
            path="/risk-management/trading_stats"
            element={
              <PageLayout headerName="Risk Mangement">
                <TradingStats />
              </PageLayout>
            }
          />
          <Route
            exact={true}
            path="/risk-management/trading_tag_list"
            element={
              <PageLayout headerName="Risk Mangement">
                <TradingTagList />
              </PageLayout>
            }
          /> */}
          <Route
            exact={true}
            path="/risk-management/newpages"
            element={
              <PageLayout headerName="Risk Mangement">
                <NewRiskManagement />
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
            path="/trader-overview/view-logs/*"
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
              <PageLayout headerName="Support">
                <StageManager />
              </PageLayout>
            }
          />
          <Route
            exact={true}
            path="/support/payout/payout-review"
            element={
              <PageLayout headerName="Payout Review">
                <PayoutReview />
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
            path="/account-analysis/:login_id/:platform/:user_id"
            element={
              <PageLayout headerName="Account Analysis">
                <AccountMetrics />
              </PageLayout>
            }
          />
          <Route
            exact={true}
            path="/account-analysis/:login_id"
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

          {/* <Route
            exact={true}
            path="/support/step-1"
            element={
              <PageLayout headerName="Support">
                <StageManager />
              </PageLayout>
            }
          /> */}
          <Route
            exact={true}
            path="/support/step-1"
            element={
              <PageLayout headerName="Support">
                <StepOne />
              </PageLayout>
            }
          />
          <Route
            exact={true}
            path="/support/step-2"
            element={
              <PageLayout headerName="Support">
                <StepTwo />
              </PageLayout>
            }
          />
          <Route
            exact={true}
            path="/support/step-3"
            element={
              <PageLayout headerName="Support">
                <StepThree />
              </PageLayout>
            }
          />
          <Route
            exact={true}
            path="/support/step-1/logs"
            element={
              <PageLayout headerName="Support">
                <Stage1Logs />
              </PageLayout>
            }
          />
          {/* <Route
            exact={true}
            path="/support/stage-2"
            element={
              <PageLayout headerName="Support">
                <StageManager />
              </PageLayout>
            }
          /> */}
          <Route
            exact={true}
            path="/support/step-2/logs"
            element={
              <PageLayout headerName="Support">
                <Stage2Logs />
              </PageLayout>
            }
          />
          <Route
            exact={true}
            path="/support/step-3/logs"
            element={
              <PageLayout headerName="Support">
                <StepThreeLogs />
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
            path="/advance-statistics/withdrawal-status"
            element={
              <PageLayout headerName="Advance Statistics">
                <WithdrawalStatus />
              </PageLayout>
            }
          />
          <Route
            exact={true}
            path="/advance-statistics/withdrawal-status/export-history"
            element={
              <PageLayout headerName="Advance Statistics">
                <WithdrawalStatusExportHistory />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/advance-statistics/withdrawal-details"
            element={
              <PageLayout headerName="Advance Statistics">
                <WithdrawalDetails />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/advance-statistics/withdrawal-details/export-history"
            element={
              <PageLayout headerName="Advance Statistics">
                <WithdrawalDetailsExportHistory />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/advance-statistics/daily-stats"
            element={
              <PageLayout headerName="Advance Statistics">
                <DailyStats />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/advance-statistics/daily-stats/export-history"
            element={
              <PageLayout headerName="Advance Statistics">
                <DailyStatsExportHistory />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/advance-statistics/pass-rates"
            element={
              <PageLayout headerName="Advance Statistics">
                <PassRates />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/advance-statistics/payout"
            element={
              <PageLayout headerName="Advance Statistics">
                <Payout />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/advance-statistics/export-history"
            element={
              <PageLayout headerName="Advance Statistics">
                <ExportHistoryTable />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/advance-statistics/payout-export-history"
            element={
              <PageLayout headerName="Advance Statistics">
                <PayoutExportHistory />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/advance-statistics/trading-pairs"
            element={
              <PageLayout headerName="Advance Statistics">
                <TradingPairs />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/advance-statistics/passed-and-failed"
            element={
              <PageLayout headerName="Advanced Statistics">
                <PassAndFailed />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/advance-statistics/dash-stats"
            element={
              <PageLayout headerName="Dash Stats">
                <DashStats />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/advance-statistics/dash-stats/export-history"
            element={
              <PageLayout headerName="New Page">
                <DashStatsExportHistory />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/certificates/all-certificates"
            element={
              <PageLayout headerName="All Certificates">
                <AllCertificates />
              </PageLayout>
            }
          />
          <Route
            exact={true}
            path="/certificates/create-certificates"
            element={
              <PageLayout headerName="Create Certificates">
                <CreateCertificates />
              </PageLayout>
            }
          />
          <Route
            exact={true}
            path="/certificates/create-certificates/view-logs"
            element={
              <PageLayout headerName="Create Certificates">
                <CreateCertificateViewLogs />
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
              <PageLayout headerName="Support">
                <StageManager />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/funded/funded-view-logs"
            element={
              <PageLayout headerName="Support">
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
            path="/affiliate-marketing/logs"
            element={
              <PageLayout headerName="Affiliate Marketing">
                <AffiliateLogs />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/affiliate-marketing/code"
            element={
              <PageLayout headerName="Affiliate Marketing">
                <AffiliateMarketingCode />
              </PageLayout>
            }
          />
          <Route
            exact={true}
            path="/affiliate-marketing/ref-list/"
            element={
              <PageLayout headerName="Affiliate Marketing">
                <Affiliate />
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
              <PageLayout headerName="Coupons">
                <Coupon />
              </PageLayout>
            }
          />

          <Route
            exact={true}
            path="/coupon/create-coupon"
            element={
              <PageLayout headerName="Coupons">
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
            path="/permissions"
            element={
              <PageLayout headerName="Permissions">
                <Permissions />
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

          <Route
            exact={true}
            path="/add-value-form"
            element={
              <PageLayout headerName="Funding Evaluation">
                <AddValueForm />
              </PageLayout>
            }
          />
          {/* <Route
            exact={true}
            path="/stage1"
            element={
              <PageLayout headerName="Support">
                <Stage1 />
              </PageLayout>
            }
          />
          <Route
            exact={true}
            path="/stage2"
            element={
              <PageLayout headerName="Support">
                <Stage2 />
              </PageLayout>
            }
          />
          <Route
            exact={true}
            path="/funded"
            element={
              <PageLayout headerName="Support">
                <NewFunded />
              </PageLayout>
            }
          />
          <Route
            exact={true}
            path="/payout"
            element={
              <PageLayout headerName="Support">
                <Payouts />
              </PageLayout>
            }
          /> */}
          <Route
            exact={true}
            path="/leaderboard/:id"
            element={
              <PageLayout headerName="Competition Overview">
                <LeaderBoard />
              </PageLayout>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
