import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { Suspense, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";

function StudentDashboard({
  currentUser,
  postData,
  chats,
  onLogout,
  unreadCount,
  notifications,
  initialChatId,
}) {
  const [chatCollapsed, setChatCollapsed] = useState(!initialChatId);
  const savedPosts = postData.savedPosts || [];
  const pendingRequests = 0;
  const confirmedBookings = 0;
  const roommateMatches = 0;
  const watchlistItems = savedPosts.slice(0, 2);

  const fallbackNotifications = [
    unreadCount > 0
      ? {
          id: "messages",
          title: `${unreadCount} unseen alert${unreadCount > 1 ? "s" : ""}`,
          body: "Open the notification bell to review your latest updates.",
        }
      : {
          id: "clear",
          title: "No unseen alerts",
          body: "Your notification feed is up to date right now.",
        },
    {
      id: "booking",
      title: "Booking updates",
      body: "Approvals, rejections, and payment reminders will appear here.",
    },
    {
      id: "watchlist",
      title: "Watchlist alerts",
      body: "We will surface newly available boardings that match your filters.",
    },
  ];

  useEffect(() => {
    document.body.classList.toggle("dashboard-chat-collapsed", chatCollapsed);

    return () => {
      document.body.classList.remove("dashboard-chat-collapsed");
    };
  }, [chatCollapsed]);

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <section className="heroCard">
            <div className="heroCopy">
              <p className="eyebrow">Student Dashboard</p>
              <h1>Welcome back, {currentUser.fullName || currentUser.username}</h1>
              <p className="heroText">
                Track your saved boardings, booking activity, messages, alerts,
                and roommate preferences from one place.
              </p>
              <div className="heroActions">
                <Link to="/list">
                  <button>Find Boardings</button>
                </Link>
                <Link to="/profile/update">
                  <button className="secondary">Update Profile</button>
                </Link>
              </div>
            </div>
            <div className="profileCard">
              <img src={currentUser.avatar || "/noavatar.jpg"} alt="" />
              <div className="profileMeta">
                <h2>{currentUser.username}</h2>
                <span>{currentUser.email}</span>
                <span>{currentUser.phone || "Add your phone number"}</span>
              </div>
              <div className="profileTags">
                <span>{currentUser.role || "student"}</span>
                <span>{currentUser.gender || "Gender not set"}</span>
                <span>{currentUser.isVerified ? "Verified" : "Verification pending"}</span>
              </div>
              <button className="logoutButton" onClick={onLogout}>
                Logout
              </button>
            </div>
          </section>

          <section className="statsGrid">
            <article className="statCard">
              <h2>{savedPosts.length}</h2>
              <p>Saved Boardings</p>
            </article>
            <article className="statCard">
              <h2>{pendingRequests}</h2>
              <p>Pending Requests</p>
            </article>
            <article className="statCard">
              <h2>{confirmedBookings}</h2>
              <p>Confirmed Bookings</p>
            </article>
            <article className="statCard">
              <h2>{roommateMatches}</h2>
              <p>Roommate Matches</p>
            </article>
          </section>

          <section className="dashboardGrid">
            <article className="panel bookingsPanel">
              <div className="panelHeading">
                <div>
                  <p className="eyebrow">Requests</p>
                  <h3>Booking Requests</h3>
                </div>
                <Link to="/list">Browse</Link>
              </div>
              <div className="statusGrid">
                <div>
                  <strong>{pendingRequests}</strong>
                  <span>Pending</span>
                </div>
                <div>
                  <strong>0</strong>
                  <span>Approved</span>
                </div>
                <div>
                  <strong>0</strong>
                  <span>Payment Due</span>
                </div>
              </div>
              <p className="emptyText">
                Once you request a boarding, the owner’s decision and payment
                step will show up here.
              </p>
            </article>

            <article className="panel" id="notifications">
              <div className="panelHeading">
                <div>
                  <p className="eyebrow">Alerts</p>
                  <h3>Notifications</h3>
                </div>
              </div>
              <div className="stackList">
                {(notifications.length > 0 ? notifications : fallbackNotifications).map((item) => (
                  <div className={`infoRow ${item.isRead ? "read" : "unread"}`} key={item.id || item.title}>
                    <strong>{item.title}</strong>
                    <span>{item.message || item.body}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel">
              <div className="panelHeading">
                <div>
                  <p className="eyebrow">Watchlist</p>
                  <h3>Tracked Boardings</h3>
                </div>
              </div>
              {watchlistItems.length > 0 ? (
                <div className="stackList">
                  {watchlistItems.map((item) => (
                    <div className="infoRow" key={item.id}>
                      <strong>{item.title}</strong>
                      <span>
                        {item.city}
                        {item.area ? `, ${item.area}` : ""} • LKR {item.rent}/month
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="emptyText">
                  Save boardings or filter-based watchlists to receive
                  availability alerts here.
                </p>
              )}
            </article>

            <article className="panel roommatePanel">
              <div className="panelHeading">
                <div>
                  <p className="eyebrow">Matching</p>
                  <h3>Roommate Finder</h3>
                </div>
                <Link to="/roommates">Open Finder</Link>
              </div>
              <p className="emptyText">
                Add your lifestyle and budget preferences to unlock same-gender
                roommate suggestions and compatibility scores.
              </p>
            </article>
          </section>

          <section className="savedSection">
            <div className="sectionHeading">
              <div>
                <p className="eyebrow">Shortlist</p>
                <h3>Saved Boardings</h3>
              </div>
              <Link to="/list">Explore More</Link>
            </div>
            {savedPosts.length > 0 ? (
              <List posts={savedPosts} />
            ) : (
              <div className="emptyPanel">
                <p>
                  You have not saved any boardings yet. Start browsing and save
                  the ones you want to revisit.
                </p>
                <Link to="/list">
                  <button>Browse Boardings</button>
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
      <div className={`chatContainer ${chatCollapsed ? "collapsed" : ""}`}>
        <div className="wrapper">
          <section className="messageShell">
            <div className="sectionHeading">
              <div>
                <p className="eyebrow">Conversations</p>
                <h3>Messages</h3>
              </div>
              <div className="messageActions">
                <span className="messagePill">{chats.length} chats</span>
                <button
                  type="button"
                  className="collapseButton"
                  onClick={() => setChatCollapsed((prev) => !prev)}
                >
                  {chatCollapsed ? "Expand" : "Collapse"}
                </button>
              </div>
            </div>
            {chatCollapsed ? (
              <div className="collapsedState">
                <strong>Chat panel hidden</strong>
                <p>
                  Reopen messages whenever you want to reply to owners or
                  roommate matches.
                </p>
              </div>
            ) : (
              <Chat chats={chats} initialChatId={initialChatId} />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function ProfilePage() {
  const data = useLoaderData();
  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const number = useNotificationStore((state) => state.number);
  const notifications = useNotificationStore((state) => state.notifications);
  const fetchNotifications = useNotificationStore((state) => state.fetch);
  const initialChatId = searchParams.get("chat");

  useEffect(() => {
    fetchNotifications().catch((err) => {
      console.log(err);
    });
  }, [fetchNotifications]);

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Suspense fallback={<p>Loading dashboard...</p>}>
      <Await
        resolve={Promise.all([data.postResponse, data.chatResponse])}
        errorElement={<p>Error loading dashboard!</p>}
      >
        {([postResponse, chatResponse]) => (
          <StudentDashboard
            currentUser={currentUser}
            postData={postResponse.data}
            chats={chatResponse.data}
            unreadCount={number}
            notifications={notifications}
            initialChatId={initialChatId}
            onLogout={handleLogout}
          />
        )}
      </Await>
    </Suspense>
  );
}

export default ProfilePage;
