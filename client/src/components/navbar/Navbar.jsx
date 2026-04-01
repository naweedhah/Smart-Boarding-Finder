import { useContext, useEffect, useMemo, useRef, useState } from "react";
import "./navbar.scss";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const alertsRef = useRef(null);

  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);
  const notifications = useNotificationStore((state) => state.notifications);
  const markRead = useNotificationStore((state) => state.markRead);

  useEffect(() => {
    if (currentUser) {
      fetch().catch((err) => {
        console.log(err);
      });
    }
  }, [currentUser, fetch]);

  const navLinks = useMemo(
    () => [
      { to: "/", label: "Home", exact: true },
      { to: "/list", label: "Find Boardings" },
      { to: "/roommates", label: "Find Roommate" },
      { to: "/watchlist", label: "Watchlist" },
      { to: "/", label: "About", staticLink: true },
    ],
    []
  );

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (alertsRef.current && !alertsRef.current.contains(event.target)) {
        setAlertsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notificationId) => {
    try {
      await markRead(notificationId);
    } catch (err) {
      console.log(err);
    }
    setAlertsOpen(false);
    navigate("/profile#notifications");
  };

  return (
    <nav>
      <div className="left">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src="/logo.png" alt="" />
          <span>BoardingFinder</span>
        </Link>
        <div className="links">
          {navLinks.map((item) => (
            item.staticLink ? (
              <Link key={item.label} to={item.to}>
                {item.label}
              </Link>
            ) : (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.exact}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {item.label}
              </NavLink>
            )
          ))}
        </div>
      </div>

      <div className="right">
        {currentUser ? (
          <div className="authActions">
            <div className="alertsWrap" ref={alertsRef}>
              <button
                type="button"
                className="notifications"
                onClick={() => setAlertsOpen((prev) => !prev)}
                aria-label="Open alerts"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 3.75a4.75 4.75 0 0 0-4.75 4.75v2.03c0 .43-.14.85-.39 1.2l-1.1 1.54A2.25 2.25 0 0 0 7.6 17h8.8a2.25 2.25 0 0 0 1.84-3.73l-1.1-1.54a2.06 2.06 0 0 1-.39-1.2V8.5A4.75 4.75 0 0 0 12 3.75Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.75 18.5a2.25 2.25 0 0 0 4.5 0"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {number > 0 && <div className="notification">{number}</div>}
              </button>

              {alertsOpen && (
                <div className="alertsDropdown">
                  <div className="alertsHeader">
                    <strong>Notifications</strong>
                    <span>{number} unseen</span>
                  </div>
                  {notifications.length > 0 ? (
                    <div className="alertsList">
                      {notifications.map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          className={`alertItem ${item.isRead ? "read" : "unread"}`}
                          onClick={() => handleNotificationClick(item.id)}
                        >
                          <strong>{item.title}</strong>
                          <span>{item.message}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="alertsEmpty">No alerts yet.</div>
                  )}
                </div>
              )}
            </div>

            <div className="user">
              <img src={currentUser.avatar || "/noavatar.jpg"} alt="" />
              <div className="userMeta">
                <strong>{currentUser.username}</strong>
                <span>{currentUser.role || "student"}</span>
              </div>
            </div>

            <Link to="/profile" className="dashboardButton" onClick={closeMenu}>
              Dashboard
            </Link>
          </div>
        ) : (
          <div className="guestActions">
            <Link to="/login" onClick={closeMenu}>
              Sign in
            </Link>
            <Link to="/register" className="register" onClick={closeMenu}>
              Sign up
            </Link>
          </div>
        )}

        <button className="menuIcon" onClick={() => setOpen((prev) => !prev)}>
          <img src="/menu.png" alt="" />
        </button>

        <div className={open ? "menu active" : "menu"}>
          <div className="menuHeader">
            <span>Menu</span>
            <button onClick={closeMenu}>Close</button>
          </div>

          <div className="menuLinks">
            {navLinks.map((item) => (
              item.staticLink ? (
                <Link key={item.label} to={item.to} onClick={closeMenu}>
                  {item.label}
                </Link>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={closeMenu}
                >
                  {item.label}
                </NavLink>
              )
            ))}
          </div>

            <div className="menuFooter">
            {currentUser ? (
              <>
                <div className="mobileUser">
                  <img src={currentUser.avatar || "/noavatar.jpg"} alt="" />
                  <div>
                    <strong>{currentUser.username}</strong>
                    <span>{currentUser.role || "student"}</span>
                  </div>
                </div>
                <Link to="/profile#notifications" onClick={closeMenu}>
                  Alerts {number > 0 ? `(${number})` : ""}
                </Link>
                <Link to="/profile" className="dashboardButton" onClick={closeMenu}>
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu}>
                  Sign in
                </Link>
                <Link to="/register" className="register" onClick={closeMenu}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
