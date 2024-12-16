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
    <div className="w-layout bg-dotted-bg bottom-0 flex h-12 flex-row items-center justify-between gap-2 rounded-t-md border border-gray-200 bg-gray-100 bg-dotted pl-4 pr-6 dark:border-gray-800 dark:bg-slate-800">
      <p className="text-xs">
        Design & Engineered by <span className="underline">ZW</span>
      </p>
      <p>|</p>
      <p className="text-xs">
        Polished by <span className="underline">501A</span>
      </p>
      <p>|</p>
      <p className="text-xs underline">Privacy Policy</p>
      <p>|</p>
      <p className="text-xs underline">How to use Shiori</p>
      <p>|</p>
      <Select
        onValueChange={() => {
          setTheme(theme === "light" ? "dark" : "light");
        }}
        defaultValue="Dark"
      >
        <SelectTrigger
          className="h-6 w-14 rounded-sm border border-gray-600 bg-gray-100 text-xs dark:bg-gray-800 dark:text-white"
          chevron={false}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="w-14">
          <SelectGroup>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="Dark">Dark</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Footer;
