import { useRouter } from "next/router";

const Language: React.FC = () => {
  const router = useRouter();
  const { locale } = router;

  const handleLanguageChange = (event: { target: { value: string } }) => {
    const newLocale = event.target.value;
    router.push(router.pathname, router.asPath, { locale: newLocale });
  };

  return (
    <div className="ml-6">
      <select
        id="language"
        className="bg-emerald-900 text-white border-none text-sm p-2 rounded hover:bg-emerald-800 "
        value={locale}
        onChange={handleLanguageChange}
      >
        <option value="en">EN</option>
        <option value="nl">NL</option>
      </select>
    </div>
  );
};

export default Language;
