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
import { RoleIsolationGate } from "@/components/common/RoleIsolationGate";

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
        <RoleIsolationGate blockRole="recruiter" redirectTo="/home">
          <CandidateLogin />
        </RoleIsolationGate>
      }
    />
    <Route
      path="/candidate/register"
      element={
        <RoleIsolationGate blockRole="recruiter" redirectTo="/home">
          <CandidateRegister />
        </RoleIsolationGate>
      }
    />
  </>
);

