import { useEffect, useState, type FC } from "react";
import {  useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const GoogleLogo: FC = () => {
  return (
    <svg
      className="w-6 h-6 text-white group-hover:text-black"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fillRule="evenodd"
        clipRule="evenodd"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fillRule="evenodd"
        clipRule="evenodd"
      />
      <path
        fill="currentColor"
        d="M5.84 13.1c-.17-.5-.26-1.04-.26-1.6s.09-1.1.26-1.6V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
        fillRule="evenodd"
        clipRule="evenodd"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
};

const Modal: FC<{
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-black border border-white text-white">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-white">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[70vh] overflow-y-auto space-y-4 text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function SignInPage() {
  const [openModal, setOpenModal] = useState<"terms" | "privacy" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (currentUser) navigate(from, { replace: true });
  }, [currentUser, from, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error: unknown) {
      console.error("Error signing in with Google:", error);
      setError((error as Error).message || "Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex fixed inset-0 bg-black/70 backdrop-blur w-full h-full items-center justify-center p-4">
      <div className="w-full max-w-md bg-black border border-white">
        {/* Top Bar */}
        <div className="flex justify-between h-12 border-b border-white">
          <div className="p-2">
            <img src={"/enigma-x-invento.png"} className="p-1 h-8 w-auto" />
          </div>

          <button
            className="border-l border-white p-2"
            onClick={() => navigate(-1)}
          >
            <X size={32} className="text-white" />
          </button>
        </div>

        {/* Main Content*/}
        <div className="p-8">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-2 font-whirlyBirdie">
              Welcome Back
            </h1>
            <p>
              Sign in to continue to <strong>ENIGMA</strong>
            </p>
            {error && (
              <div className="mt-4 p-3 bg-red-900/50 border border-red-500 text-red-100 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>

          <div className="space-y-6 mt-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className={cn(
                "flex group w-full items-center justify-center p-2",
                "border border-white space-x-3 transition-all duration-300",
                isLoading ? "opacity-70 cursor-not-allowed" : " hover:bg-white",
              )}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-white">Signing in...</span>
                </>
              ) : (
                <>
                  <GoogleLogo />
                  <span className="text-white group-hover:text-black text-base">
                    Continue with Google
                  </span>
                </>
              )}
            </button>
            <div className="text-white text-[10px] text-center">
              By clicking Log in, you agree to our <span><button onClick={() => setOpenModal("terms")} className="underline" >Terms of Service</button></span>. Learn how we process your data in our <span><button onClick={() => setOpenModal("privacy")} className="underline">Privacy Policy</button></span>.
            </div>
          </div>
        </div>
      </div>
      {openModal === "terms" && (
        <Modal title="Terms of Service – Enigma" onClose={() => setOpenModal(null)}>
          <p><strong>Last updated:</strong> December 2025</p>
          <p><strong>1. About Enigma</strong><br />Enigma is an online puzzle hunt game developed and hosted by Team Invento, as part of Invento 26, the multi-fest of Government Engineering College, Palakkad.
By accessing or participating in Enigma, you agree to comply with these Terms of Service.</p>
          <p><strong>2. Eligibility</strong><br />Participation is open to users who sign in using a valid Google account.
By participating, you confirm that the information provided is accurate and that you are participating voluntarily.</p>
          <p><strong>3. User Account & Authentication</strong><br />Enigma uses Google Authentication for sign-in.
We do not create separate usernames or passwords.</p>
          <p><strong>4. Game Rules & Fair Play</strong><br />Players must not use unfair means, automated tools, bots, or external assistance that violates the spirit of the puzzle hunt.
Any attempt to manipulate scores, exploit bugs, or disrupt the platform may result in disqualification without prior notice.</p>
          <p><strong>5. Intellectual Property</strong><br />All puzzles, designs, content, branding, and game mechanics are the intellectual property of Team Invento.
Copying, reproducing, or redistributing Enigma’s content without permission is strictly prohibited.</p>
          <p><strong>6. Modifications & Availability</strong><br />Team Invento reserves the right to modify, suspend, or terminate Enigma or its features at any time without prior notice.
We are not liable for temporary downtime or technical issues.</p>
          <p><strong>7. Limitation of Liability</strong><br />Enigma is provided “as is.”</p>
          <p>Team Invento shall not be held responsible for any data loss, device issues, or indirect damages arising from participation.</p>
        </Modal>
      )}

      {/* ---------- Privacy Modal ---------- */}
      {openModal === "privacy" && (
        <Modal title="Privacy Policy – Enigma" onClose={() => setOpenModal(null)}>
          <p><strong>Last updated:</strong> December 2025</p>
          <p><strong>1. Information We Collect</strong><br />Enigma uses Google Authentication via Firebase. When you sign in, we collect only the following information from your Google account: Name, Email address, Profile picture (display photo), No additional personal data is collected.</p>
          <p><strong>2. How We Use Your Information</strong><br />The collected information is used solely to: Identify participants uniquely Display your name and profile picture within the game interface Manage gameplay, progress tracking, and leaderboards We do not use your data for marketing, advertising, or third-party promotions.</p>
          <p><strong>3. Data Storage & Security</strong><br />All authentication and data handling is managed securely using Firebase backend services.
Reasonable security measures are in place to protect your information from unauthorized access.</p>
          <p><strong>4. Data Sharing</strong><br />We do not sell, trade, or share your personal information with third parties.
Your data is accessible only to the Enigma development and organizing team for operational purposes.</p>
          <p><strong>5. Data Retention</strong><br />User data is retained only for the duration necessary to conduct the event and related activities.
After the event, data may be removed or anonymized unless required for record-keeping.</p>
          <p><strong>6. User Consent</strong><br />By signing in and using Enigma, you consent to the collection and use of your information as described in this Privacy Policy.</p>
          <p><strong>7. Changes to This Policy</strong><br />Team Invento reserves the right to update this Privacy Policy if required. Any changes will be reflected on this page</p>
          <p><strong>Contact</strong><br />For queries, concerns, or data-related requests, please contact Team Invento 26, Government Engineering College Palakkad through official Invento communication channels.</p>
        </Modal>
      )}
    </div>

  );
}
