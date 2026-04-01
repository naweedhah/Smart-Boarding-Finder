import "./roommatePage.scss";
import apiRequest from "../../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useState } from "react";

const CITY_OPTIONS = [
  "Colombo",
  "Kandy",
  "Galle",
  "Jaffna",
  "Kurunegala",
  "Matara",
  "Negombo",
  "Anuradhapura",
  "Ratnapura",
  "Badulla",
];

const UNIVERSITY_OPTIONS = [
  "University of Peradeniya",
  "University of Colombo",
  "University of Moratuwa",
  "University of Kelaniya",
  "University of Sri Jayewardenepura",
  "University of Ruhuna",
  "University of Jaffna",
  "Rajarata University of Sri Lanka",
  "Sabaragamuwa University of Sri Lanka",
  "Wayamba University of Sri Lanka",
  "Eastern University, Sri Lanka",
  "South Eastern University of Sri Lanka",
  "Uva Wellassa University",
  "NSBM Green University",
  "SLIIT",
  "IIT Sri Lanka",
];

const YEAR_OPTIONS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "Final Year",
  "Graduate",
  "Postgraduate",
];

const FOOD_OPTIONS = [
  "Vegetarian-friendly",
  "No special preference",
  "Halal-friendly",
  "Vegan-friendly",
];

const defaultForm = {
  age: "",
  university: "",
  faculty: "",
  yearOfStudy: "",
  budgetMin: "",
  budgetMax: "",
  preferredCity: "",
  preferredArea: "",
  sleepSchedule: "",
  cleanlinessLevel: "",
  studyHabit: "",
  smokingAllowed: "",
  petsAllowed: "",
  foodPreference: "",
  sociabilityLevel: "",
  notes: "",
};

const validateRoommateForm = (values) => {
  const nextErrors = {};
  const age = Number(values.age);
  const budgetMin = Number(values.budgetMin);
  const budgetMax = Number(values.budgetMax);
  const cleanlinessLevel = Number(values.cleanlinessLevel);
  const sociabilityLevel = Number(values.sociabilityLevel);

  if (!values.preferredCity) {
    nextErrors.preferredCity = "Please select a preferred city.";
  }

  if (!values.preferredArea.trim()) {
    nextErrors.preferredArea = "Preferred area is required.";
  } else if (values.preferredArea.trim().length < 2) {
    nextErrors.preferredArea = "Preferred area must be at least 2 characters.";
  }

  if (!values.budgetMin) {
    nextErrors.budgetMin = "Minimum budget is required.";
  } else if (Number.isNaN(budgetMin) || budgetMin < 5000) {
    nextErrors.budgetMin = "Minimum budget must be at least LKR 5,000.";
  }

  if (!values.budgetMax) {
    nextErrors.budgetMax = "Maximum budget is required.";
  } else if (Number.isNaN(budgetMax) || budgetMax < budgetMin) {
    nextErrors.budgetMax =
      "Maximum budget must be greater than or equal to minimum budget.";
  }

  if (!values.university) {
    nextErrors.university = "Please select your university.";
  }

  if (!values.faculty.trim()) {
    nextErrors.faculty = "Faculty is required.";
  } else if (values.faculty.trim().length < 2) {
    nextErrors.faculty = "Faculty must be at least 2 characters.";
  }

  if (!values.yearOfStudy) {
    nextErrors.yearOfStudy = "Please select your year of study.";
  }

  if (!values.sleepSchedule) {
    nextErrors.sleepSchedule = "Please select your sleep schedule.";
  }

  if (!values.studyHabit) {
    nextErrors.studyHabit = "Please select your study habit.";
  }

  if (!values.age) {
    nextErrors.age = "Age is required.";
  } else if (Number.isNaN(age) || age < 16 || age > 60) {
    nextErrors.age = "Age must be between 16 and 60.";
  }

  if (!values.cleanlinessLevel) {
    nextErrors.cleanlinessLevel = "Please choose your cleanliness level.";
  } else if (
    Number.isNaN(cleanlinessLevel) ||
    cleanlinessLevel < 1 ||
    cleanlinessLevel > 5
  ) {
    nextErrors.cleanlinessLevel = "Cleanliness level must be between 1 and 5.";
  }

  if (!values.sociabilityLevel) {
    nextErrors.sociabilityLevel = "Please choose your sociability level.";
  } else if (
    Number.isNaN(sociabilityLevel) ||
    sociabilityLevel < 1 ||
    sociabilityLevel > 5
  ) {
    nextErrors.sociabilityLevel = "Sociability level must be between 1 and 5.";
  }

  if (values.smokingAllowed === "") {
    nextErrors.smokingAllowed = "Please select a smoking preference.";
  }

  if (values.petsAllowed === "") {
    nextErrors.petsAllowed = "Please select a pets preference.";
  }

  if (!values.foodPreference) {
    nextErrors.foodPreference = "Please select a food preference.";
  }

  if (values.notes.trim().length > 300) {
    nextErrors.notes = "Notes must stay within 300 characters.";
  }

  return nextErrors;
};

function RoommatePageContent({ initialProfile, initialMatches }) {
  const [form, setForm] = useState({
    ...defaultForm,
    ...(initialProfile || {}),
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [matches, setMatches] = useState(initialMatches || []);
  const [isSaving, setIsSaving] = useState(false);
  const [activeMessageUserId, setActiveMessageUserId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const hasProfile = Boolean(initialProfile);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextForm = {
      ...form,
      [name]: value,
    };

    setForm(nextForm);

    if (touchedFields[name]) {
      const nextErrors = validateRoommateForm(nextForm);
      setFieldErrors((prev) => ({
        ...prev,
        [name]: nextErrors[name],
      }));
    }
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    const nextErrors = validateRoommateForm(form);

    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));
    setFieldErrors((prev) => ({
      ...prev,
      [name]: nextErrors[name],
    }));
  };

  const refreshMatches = async () => {
    const matchesRes = await apiRequest("/users/roommate-matches");
    setMatches(matchesRes.data);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    const nextErrors = validateRoommateForm(form);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setTouchedFields({
        age: true,
        university: true,
        faculty: true,
        yearOfStudy: true,
        budgetMin: true,
        budgetMax: true,
        preferredCity: true,
        preferredArea: true,
        sleepSchedule: true,
        cleanlinessLevel: true,
        studyHabit: true,
        smokingAllowed: true,
        petsAllowed: true,
        foodPreference: true,
        sociabilityLevel: true,
        notes: true,
      });
      return;
    }

    setIsSaving(true);

    try {
      await apiRequest.put("/users/roommate-profile", {
        ...form,
      });
      await refreshMatches();
      setMessage("Roommate preferences saved. Your latest matches are ready.");
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.message || "Failed to save roommate preferences.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleMessageMatch = async (matchUserId) => {
    setError("");
    setMessage("");
    setActiveMessageUserId(matchUserId);

    try {
      const res = await apiRequest.post("/chats", { receiverId: matchUserId });
      navigate(`/profile?chat=${res.data.id}`);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to open conversation.");
    } finally {
      setActiveMessageUserId("");
    }
  };

  return (
    <div className="roommatePage">
      <section className="heroCard">
        <div className="heroCopy">
          <p className="eyebrow">Find Roommate</p>
          <h1>Match with students who fit your lifestyle.</h1>
          <p className="heroText">
            Complete your roommate profile once, then we will compare budget,
            area, study habits, routine, and lifestyle preferences to suggest
            same-gender matches.
          </p>
          <div className="heroActions">
            <Link to="/profile">
              <button className="secondary">Back to Dashboard</button>
            </Link>
            <Link to="/watchlist">
              <button>View Watchlist</button>
            </Link>
          </div>
        </div>
        <div className="summaryCard">
          <strong>{matches.length}</strong>
          <span>
            {matches.length === 1 ? "active match" : "active matches"}
          </span>
          <p>
            {hasProfile
              ? "Your latest results are scored and ranked below."
              : "Complete the questionnaire to unlock same-gender roommate suggestions."}
          </p>
        </div>
      </section>

      <div className="contentGrid">
        <section className="panel formPanel">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">Questionnaire</p>
              <h2>
                {hasProfile
                  ? "Update Preferences"
                  : "Complete Your Roommate Profile"}
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="roommateForm">
            <div className="formSection">
              <h3>Location & Budget</h3>
              <div className="fieldGrid">
                <label>
                  <span>Preferred City</span>
                  <select
                    name="preferredCity"
                    value={form.preferredCity || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select city</option>
                    {CITY_OPTIONS.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.preferredCity && (
                    <small>{fieldErrors.preferredCity}</small>
                  )}
                </label>
                <label>
                  <span>Preferred Area</span>
                  <input
                    name="preferredArea"
                    value={form.preferredArea || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Peradeniya"
                  />
                  {fieldErrors.preferredArea && (
                    <small>{fieldErrors.preferredArea}</small>
                  )}
                </label>
                <label>
                  <span>Budget Min</span>
                  <input
                    name="budgetMin"
                    type="number"
                    value={form.budgetMin || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="18000"
                  />
                  {fieldErrors.budgetMin && (
                    <small>{fieldErrors.budgetMin}</small>
                  )}
                </label>
                <label>
                  <span>Budget Max</span>
                  <input
                    name="budgetMax"
                    type="number"
                    value={form.budgetMax || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="30000"
                  />
                  {fieldErrors.budgetMax && (
                    <small>{fieldErrors.budgetMax}</small>
                  )}
                </label>
              </div>
            </div>

            <div className="formSection">
              <h3>Study & Routine</h3>
              <div className="fieldGrid">
                <label>
                  <span>University</span>
                  <select
                    name="university"
                    value={form.university || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select university</option>
                    {UNIVERSITY_OPTIONS.map((university) => (
                      <option key={university} value={university}>
                        {university}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.university && (
                    <small>{fieldErrors.university}</small>
                  )}
                </label>
                <label>
                  <span>Faculty</span>
                  <input
                    name="faculty"
                    value={form.faculty || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Engineering"
                  />
                  {fieldErrors.faculty && <small>{fieldErrors.faculty}</small>}
                </label>
                <label>
                  <span>Year of Study</span>
                  <select
                    name="yearOfStudy"
                    value={form.yearOfStudy || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select year</option>
                    {YEAR_OPTIONS.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.yearOfStudy && (
                    <small>{fieldErrors.yearOfStudy}</small>
                  )}
                </label>
                <label>
                  <span>Sleep Schedule</span>
                  <select
                    name="sleepSchedule"
                    value={form.sleepSchedule || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select</option>
                    <option value="Sleeps before midnight">
                      Sleeps before midnight
                    </option>
                    <option value="Late sleeper">Late sleeper</option>
                    <option value="Early riser">Early riser</option>
                  </select>
                  {fieldErrors.sleepSchedule && (
                    <small>{fieldErrors.sleepSchedule}</small>
                  )}
                </label>
                <label>
                  <span>Study Habit</span>
                  <select
                    name="studyHabit"
                    value={form.studyHabit || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select</option>
                    <option value="Quiet evenings">Quiet evenings</option>
                    <option value="Group study">Group study</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                  {fieldErrors.studyHabit && (
                    <small>{fieldErrors.studyHabit}</small>
                  )}
                </label>
                <label>
                  <span>Age</span>
                  <input
                    name="age"
                    type="number"
                    value={form.age || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="22"
                  />
                  {fieldErrors.age && <small>{fieldErrors.age}</small>}
                </label>
              </div>
            </div>

            <div className="formSection">
              <h3>Lifestyle Preferences</h3>
              <div className="fieldGrid">
                <label>
                  <span>Cleanliness Level</span>
                  <select
                    name="cleanlinessLevel"
                    value={form.cleanlinessLevel || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select</option>
                    <option value="1">1 - Flexible</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5 - Very tidy</option>
                  </select>
                  {fieldErrors.cleanlinessLevel && (
                    <small>{fieldErrors.cleanlinessLevel}</small>
                  )}
                </label>
                <label>
                  <span>Sociability Level</span>
                  <select
                    name="sociabilityLevel"
                    value={form.sociabilityLevel || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select</option>
                    <option value="1">1 - Quiet</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5 - Very social</option>
                  </select>
                  {fieldErrors.sociabilityLevel && (
                    <small>{fieldErrors.sociabilityLevel}</small>
                  )}
                </label>
                <label>
                  <span>Smoking Preference</span>
                  <select
                    name="smokingAllowed"
                    value={form.smokingAllowed ?? ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select</option>
                    <option value="false">No smoking</option>
                    <option value="true">Smoking allowed</option>
                  </select>
                  {fieldErrors.smokingAllowed && (
                    <small>{fieldErrors.smokingAllowed}</small>
                  )}
                </label>
                <label>
                  <span>Pets Preference</span>
                  <select
                    name="petsAllowed"
                    value={form.petsAllowed ?? ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select</option>
                    <option value="false">No pets</option>
                    <option value="true">Pets allowed</option>
                  </select>
                  {fieldErrors.petsAllowed && (
                    <small>{fieldErrors.petsAllowed}</small>
                  )}
                </label>
                <label>
                  <span>Food Preference</span>
                  <select
                    name="foodPreference"
                    value={form.foodPreference || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select</option>
                    {FOOD_OPTIONS.map((foodOption) => (
                      <option key={foodOption} value={foodOption}>
                        {foodOption}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.foodPreference && (
                    <small>{fieldErrors.foodPreference}</small>
                  )}
                </label>
                <label className="fullWidth">
                  <span>Notes</span>
                  <textarea
                    name="notes"
                    value={form.notes || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Anything important for a future roommate to know?"
                  />
                  {fieldErrors.notes && <small>{fieldErrors.notes}</small>}
                </label>
              </div>
            </div>

            <div className="formActions">
              <button type="submit" disabled={isSaving}>
                {isSaving
                  ? "Saving..."
                  : hasProfile
                    ? "Update Preferences"
                    : "Save Preferences"}
              </button>
              {message && <span className="successText">{message}</span>}
              {error && <span className="errorText">{error}</span>}
            </div>
          </form>
        </section>

        <section className="panel matchesPanel">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">Results</p>
              <h2>Your Best Matches</h2>
            </div>
          </div>

          {matches.length > 0 ? (
            <div className="matchesList">
              {matches.map((match) => (
                <article className="matchCard" key={match.user.id}>
                  <div className="matchTop">
                    <div className="matchIdentity">
                      <img src={match.user.avatar || "/noavatar.jpg"} alt="" />
                      <div>
                        <strong>
                          {match.user.fullName || match.user.username}
                        </strong>
                        <span>
                          {match.user.university || "University not added"}
                        </span>
                      </div>
                    </div>
                    <div className="scoreBadge">{match.score}%</div>
                  </div>

                  <div className="scoreBar">
                    <div
                      className="scoreFill"
                      style={{ width: `${match.score}%` }}
                    ></div>
                  </div>

                  <div className="matchMeta">
                    <span>{match.user.preferredCity || "City not set"}</span>
                    <span>
                      {match.user.budgetMin && match.user.budgetMax
                        ? `LKR ${match.user.budgetMin} - ${match.user.budgetMax}`
                        : "Budget not set"}
                    </span>
                    <span>{match.user.faculty || "Faculty not set"}</span>
                  </div>

                  <div className="reasonList">
                    {match.reasons.map((reason) => (
                      <span key={reason}>{reason}</span>
                    ))}
                  </div>

                  <div className="matchActions">
                    <button
                      type="button"
                      onClick={() => handleMessageMatch(match.user.id)}
                      disabled={activeMessageUserId === match.user.id}
                    >
                      {activeMessageUserId === match.user.id
                        ? "Opening..."
                        : "Message Match"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="emptyState">
              <strong>No roommate matches yet</strong>
              <p>
                Save your preferences first. Once enough same-gender student
                profiles overlap on location and budget, the best matches will
                show up here.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function RoommatePage() {
  const data = useLoaderData();

  return (
    <Suspense fallback={<p>Loading roommate page...</p>}>
      <Await
        resolve={Promise.all([data.profileResponse, data.matchesResponse])}
        errorElement={<p>Failed to load roommate page!</p>}
      >
        {([profileResponse, matchesResponse]) => (
          <RoommatePageContent
            initialProfile={profileResponse.data}
            initialMatches={matchesResponse.data}
          />
        )}
      </Await>
    </Suspense>
  );
}

export default RoommatePage;
