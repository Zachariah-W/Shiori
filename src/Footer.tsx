import { FiMoon, FiSun } from "react-icons/fi";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { useTheme } from "./ThemeContext";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Footer = () => {
  const { theme, setTheme } = useTheme();
  const [privacyPolicyClicked, setPrivacyPolicyClicked] =
    useState<boolean>(false);
  return (
    <div className="w-layout flex flex-row items-center justify-between gap-2 rounded-t-2xl border-2 border-neutral-200 bg-neutral-100 bg-dotted p-6 text-xs dark:border-neutral-800 dark:bg-neutral-900">
      <p>
        Made by <span className="underline">ZW</span>
      </p>
      <p>
        Polished by <span className="underline">501A</span>
      </p>
      <button
        onClick={() => {
          setPrivacyPolicyClicked(true);
        }}
      >
        Privacy Policy
      </button>
      <button>How to use Shiori</button>
      <Select
        onValueChange={() => setTheme(theme === "light" ? "dark" : "light")}
        defaultValue="dark"
        aria-label="Theme"
      >
        <SelectTrigger
          icon={theme === "light" ? <FiSun /> : <FiMoon />}
          chevron={false}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="w-14">
          <SelectGroup>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Dialog
        open={privacyPolicyClicked}
        onOpenChange={() => {
          setPrivacyPolicyClicked(!privacyPolicyClicked);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
            <DialogDescription className="*:py-2">
              <p>
                At Shiori, we value your privacy and aim to keep our policies
                clear and simple. This privacy policy outlines how we collect,
                use, and protect your data. By using Shiori, you agree to these
                terms.
              </p>
              <p>
                We collect essential data to provide and improve our services,
                including your email address, account creation date, last login,
                and trip details such as titles, locations, and notes. Metadata
                like last edited dates is also stored to enhance your
                experience.
              </p>
              <p>
                Your data helps us improve Shiori, add features, and notify you
                about updates. We use trusted third-party tools like PostHog for
                analytics and Firebase for secure data storage. For more
                details, see Google’s Privacy Policy.
              </p>
              <p>
                We prioritize data security with encryption and secure storage
                practices. Please ensure your account credentials remain
                confidential.
              </p>
              <p>
                This policy may be updated periodically. Significant changes
                will be communicated through the platform, but we encourage you
                to review it regularly. By continuing to use Shiori, you accept
                any updates. Contact us with questions or concerns through our
                support channels.
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Footer;
