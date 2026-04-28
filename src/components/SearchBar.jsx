import { setIsSearch } from "@/store/StoreAction";
import { Search } from "lucide-react";

const SearchBar = ({
  search,
  dispatch,
  setOnSearch,
  onSearch,
  label = "Search....",
}) => {
  const handleChange = (e, search) => {
    search.current.value = e.target.value;
    if (e.target.value === "") {
      setOnSearch(!onSearch);
      dispatch(setIsSearch(false));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let val = search.current.value;
    console.log("val", val);

    if (val === " " || val === "") {
      setOnSearch(!onSearch);
      dispatch(setIsSearch(false));
      return;
    } else {
      setOnSearch(!onSearch);
      dispatch(setIsSearch(true));
    }
  };

  return (
    <form
      onSubmit={(e) => {
        // console.log(search.current.value);
        handleSubmit(e);
      }}
      className="search-box"
    >
      <div className="relative">
        <div
          type="submit"
          className="absolute left-2 top-2.5 text-[14px] h-[30px] rounded-tr-none rounded-br-none border-l-0  text-gray-400 cursor-default"
        >
          <Search className="size-4" />
        </div>
        <input
          type="search"
          placeholder={label}
          className="text-xs py-0 h-[30px] pl-8 rounded-lg"
          ref={search}
          onChange={(e) => handleChange(e, search)}
        />
      </div>
    </form>
  );
};

export default SearchBar;
