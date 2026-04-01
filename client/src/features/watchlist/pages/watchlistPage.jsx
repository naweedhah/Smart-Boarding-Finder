import { Await, Link, useLoaderData } from "react-router-dom";
import { Suspense } from "react";
import List from "../../../components/list/List";
import "./watchlistPage.scss";

function WatchlistContent({ savedPosts }) {
  return (
    <div className="watchlistPage">
      <section className="heroCard">
        <div>
          <p className="eyebrow">Quick Access</p>
          <h1>Your Watchlist</h1>
          <p className="heroText">
            Revisit the boarding places you have saved and keep track of the
            options you want to compare later.
          </p>
        </div>
        <div className="summaryCard">
          <strong>{savedPosts.length}</strong>
          <span>Saved boardings ready to review</span>
        </div>
      </section>

      <section className="watchlistSection">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">Saved Boardings</p>
            <h2>Boardings You Are Tracking</h2>
          </div>
          <Link to="/list">Browse More</Link>
        </div>

        {savedPosts.length > 0 ? (
          <List posts={savedPosts} />
        ) : (
          <div className="emptyPanel">
            <p>
              Your watchlist is empty right now. Save boardings from the listing
              pages to see them here for quick access.
            </p>
            <Link to="/list">
              <button>Find Boardings</button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

function WatchlistPage() {
  const data = useLoaderData();

  return (
    <Suspense fallback={<p>Loading watchlist...</p>}>
      <Await
        resolve={data.postResponse}
        errorElement={<p>Failed to load watchlist!</p>}
      >
        {(postResponse) => (
          <WatchlistContent savedPosts={postResponse.data.savedPosts || []} />
        )}
      </Await>
    </Suspense>
  );
}

export default WatchlistPage;
