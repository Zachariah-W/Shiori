import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { useTheme } from "./ThemeContext";

const Footer = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="w-layout bg-dotted flex h-12 flex-row items-center justify-between gap-2 rounded-t-2xl border-2 border-neutral-200 dark:border-neutral-700 bg-neutral-100 p-6 dark:bg-neutral-800 text-xs">
      <p>
        Design & Engineered by <span className="underline">ZW</span>
      </p>
      <p>
        Polished by <span className="underline">501A</span>
      </p>
      <p>Privacy Policy</p>
      <p>How to use Shiori</p>
      <Select
        onValueChange={() => setTheme(theme === "light" ? "dark" : "light")}
        defaultValue="dark"
        aria-label="Theme"
      >
        <SelectTrigger
          className="h-6 w-14 rounded-sm border border-gray-600 bg-neutral-100 text-xs dark:bg-gray-800 dark:text-white"
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
    </div>
  );
};

export default Footer;
