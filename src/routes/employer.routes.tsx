import { Route } from "react-router-dom";
import { lazy } from "react";

const ContactsPage = lazy(() => import("@/pages/company/ContactsPage"));

// Company management routes
export const employerRoutes = (
    <>
        <Route path="/contacts" element={<ContactsPage />} />
        {/* Future employer-specific routes go here */}
    </>
);
