import { useState } from "react";
import "./searchBar.scss";
import { Link } from "react-router-dom";

const preferredTenantGenders = [
  { value: "any", label: "Any" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

function SearchBar() {
  const [query, setQuery] = useState({
    preferredTenantGender: "any",
    city: "",
    area: "",
    minPrice: 0,
    maxPrice: 0,
  });

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, preferredTenantGender: val }));
  };

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="searchBar">
      <div className="type">
        {preferredTenantGenders.map((option) => (
          <button
            key={option.value}
            onClick={() => switchType(option.value)}
            className={
              query.preferredTenantGender === option.value ? "active" : ""
            }
          >
            {option.label}
          </button>
        ))}
      </div>
      <form>
        <input
          type="text"
          name="city"
          placeholder="City"
          onChange={handleChange}
        />
        <input
          type="text"
          name="area"
          placeholder="Area"
          onChange={handleChange}
        />
        <input
          type="number"
          name="minPrice"
          min={0}
          max={10000000}
          placeholder="Min Rent"
          onChange={handleChange}
        />
        <input
          type="number"
          name="maxPrice"
          min={0}
          max={10000000}
          placeholder="Max Rent"
          onChange={handleChange}
        />
        <Link
          to={`/list?preferredTenantGender=${query.preferredTenantGender}&city=${query.city}&area=${query.area}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}
        >
          <button>
            <img src="/search.png" alt="" />
          </button>
        </Link>
      </form>
    </div>
  );
}

export default SearchBar;
