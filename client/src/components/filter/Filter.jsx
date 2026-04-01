import { useState } from "react";
import "./filter.scss";
import { useSearchParams } from "react-router-dom";

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({
    preferredTenantGender: searchParams.get("preferredTenantGender") || "",
    city: searchParams.get("city") || "",
    area: searchParams.get("area") || "",
    boardingType: searchParams.get("boardingType") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    capacity: searchParams.get("capacity") || "",
  });

  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = () => {
    setSearchParams(query);
  };

  return (
    <div className="filter">
      <h1>
        Boarding results for{" "}
        <b>{searchParams.get("city") || searchParams.get("area") || "all areas"}</b>
      </h1>
      <div className="top">
        <div className="item">
          <label htmlFor="city">Location</label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="City"
            onChange={handleChange}
            defaultValue={query.city}
          />
        </div>
        <div className="item">
          <label htmlFor="area">Area</label>
          <input
            type="text"
            id="area"
            name="area"
            placeholder="Area or neighborhood"
            onChange={handleChange}
            defaultValue={query.area}
          />
        </div>
      </div>
      <div className="bottom">
        <div className="item">
          <label htmlFor="preferredTenantGender">Preferred Gender</label>
          <select
            name="preferredTenantGender"
            id="preferredTenantGender"
            onChange={handleChange}
            defaultValue={query.preferredTenantGender}
          >
            <option value="">any</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="boardingType">Boarding Type</label>
          <select
            name="boardingType"
            id="boardingType"
            onChange={handleChange}
            defaultValue={query.boardingType}
          >
            <option value="">any</option>
            <option value="singleRoom">Single Room</option>
            <option value="sharedRoom">Shared Room</option>
            <option value="annex">Annex</option>
            <option value="hostel">Hostel</option>
            <option value="houseShare">House Share</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="minPrice">Min Rent</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="any"
            onChange={handleChange}
            defaultValue={query.minPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="maxPrice">Max Rent</label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            placeholder="any"
            onChange={handleChange}
            defaultValue={query.maxPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="capacity">Available Slots</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            placeholder="any"
            onChange={handleChange}
            defaultValue={query.capacity}
          />
        </div>
        <button onClick={handleFilter}>
          <img src="/search.png" alt="" />
        </button>
      </div>
    </div>
  );
}

export default Filter;
