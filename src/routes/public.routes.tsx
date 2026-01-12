import { Route } from "react-router-dom";
import VerifyCertificate from "@/pages/VerifyCertificate";
import VerifyCompany from "@/pages/VerifyCompany";
import ConsentForm from "@/pages/ConsentForm";
import ReferenceQuestionnaire from "@/pages/ReferenceQuestionnaire";
import AIReferenceSession from "@/pages/AIReferenceSession";
import VideoInterviewInterface from "@/pages/VideoInterviewInterface";
import PhoneInterviewInterface from "@/pages/PhoneInterviewInterface";
import AIInterviewComplete from "@/pages/AIInterviewComplete";
import TakeAssessment from "@/pages/public/TakeAssessment";
import PublicFeedbackForm from "@/pages/PublicFeedbackForm";
import CandidateLogin from "@/pages/candidate/Login";
import CandidateRegister from "@/pages/candidate/Register";
import UpgradeCheckoutResult from "@/pages/UpgradeCheckoutResult";
import { AnyAuthRedirectGate } from "@/components/common/AnyAuthRedirectGate";
import JobSearchPage from "@/pages/candidate/JobSearchPage";
import JobDetailPage from "@/pages/candidate/JobDetailPage";
import ApplyPage from "@/pages/candidate/ApplyPage";
import CompanyDetailPage from "@/pages/candidate/CompanyDetailPage";
import CareersPage from "@/pages/candidate/CareersPage";

export const publicRoutes = (
    <>
        <Route path="/verify/:code?" element={<VerifyCertificate />} />
        <Route path="/verify-company" element={<VerifyCompany />} />
        <Route path="/consent/:token" element={<ConsentForm />} />
        <Route path="/reference/:token" element={<ReferenceQuestionnaire />} />
        <Route path="/ai-reference/:token" element={<AIReferenceSession />} />
        <Route path="/ai-reference/:token/video" element={<VideoInterviewInterface />} />
        <Route path="/ai-reference/:token/phone" element={<PhoneInterviewInterface />} />
        <Route path="/ai-reference/:token/complete" element={<AIInterviewComplete />} />
        <Route path="/assessment/:token" element={<TakeAssessment />} />
        <Route path="/feedback/:feedbackId/:providerId" element={<PublicFeedbackForm />} />

        {/* Candidate Auth Routes (public, no auth required) */}
        <Route
            path="/candidate/login"
            element={
                <AnyAuthRedirectGate>
                    <CandidateLogin />
                </AnyAuthRedirectGate>
            }
        />
        <Route
            path="/candidate/register"
            element={
                <AnyAuthRedirectGate>
                    <CandidateRegister />
                </AnyAuthRedirectGate>
            }
        />
        <Route path="/upgrade-success" element={<UpgradeCheckoutResult />} />
        <Route path="/upgrade-cancelled" element={<UpgradeCheckoutResult />} />

        {/* Public Job Board Routes */}
        <Route path="/jobs" element={<JobSearchPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/jobs/:id/apply" element={<ApplyPage />} />

        {/* Public Company Careers Pages */}
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/companies/:id" element={<CompanyDetailPage />} />
    </>
);
